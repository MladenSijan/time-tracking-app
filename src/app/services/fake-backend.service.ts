import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, materialize, dematerialize} from 'rxjs/operators';

import {AlertService, DatabaseService} from './index';
import {Role} from '../models';

const accountsKey = 'accounts';
const accounts = JSON.parse(localStorage.getItem(accountsKey)) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor(
    private db: DatabaseService,
    private alertService: AlertService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;
    const alertService = this.alertService;
    const db = this.db;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/oauth/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/oauth/refresh-token') && method === 'POST':
          return refreshToken();
        case url.endsWith('/oauth/revoke-token') && method === 'POST':
          return revokeToken();
        case url.endsWith('/oauth/register') && method === 'POST':
          return register();
        case url.endsWith('/accounts') && method === 'GET':
          return getAccounts();
        case url.match(/\/accounts\/\d+$/) && method === 'GET':
          return getAccountById();
        case url.endsWith('/accounts') && method === 'POST':
          return createAccount();
        case url.match(/\/accounts\/\d+$/) && method === 'PUT':
          return updateAccount();
        case url.endsWith('/users') && method === 'GET':
          return getEmployees();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const {email, password} = body;
      const account = accounts.find(x => x.email === email && x.password === password);

      if (!account) {
        return error('Email or password is incorrect');
      }

      // add refresh token to account
      account.refreshTokens.push(generateRefreshToken());
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok({
        ...basicDetails(account),
        jwtToken: generateJwtToken(account)
      });
    }

    function refreshToken() {
      const refreshTnk = getRefreshToken();

      if (!refreshTnk) {
        return unauthorized();
      }

      const account = accounts.find(x => x.refreshTokens.includes(refreshTnk));

      if (!account) {
        return unauthorized();
      }

      // replace old refresh token with a new one and save
      account.refreshTokens = account.refreshTokens.filter(x => x !== refreshTnk);
      account.refreshTokens.push(generateRefreshToken());
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok({
        ...basicDetails(account),
        jwtToken: generateJwtToken(account)
      });

    }

    function revokeToken() {
      if (!isAuthenticated()) {
        return unauthorized();
      }

      const refreshTnk = getRefreshToken();
      const account = accounts.find(x => x.refreshTokens.includes(refreshTnk));

      // revoke token and save
      account.refreshTokens = account.refreshTokens.filter(x => x !== refreshTnk);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok();
    }

    function register() {
      const account = body;

      if (accounts.find(x => x.email === account.email)) {
        // display email already registered "email" in alert
        setTimeout(() => {
          alertService.info(`
                        <h4>Email Already Registered</h4>
                        <p>Your email ${account.email} is already registered.</p>
                        <p>If you don't know your password please visit the <a href="${location.origin}/account/forgot-password">forgot password</a> page.</p>
                        <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>
                    `, {autoClose: false});
        }, 1000);

        // always return ok() response to prevent email enumeration
        return ok();
      }

      // assign account id and a few other properties then save
      account.id = newAccountId();
      account.role = Role.Admin;
      account.verificationToken = new Date().getTime().toString();
      account.isVerified = false;
      account.refreshTokens = [];
      delete account.confirmPassword;
      accounts.push(account);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      // display verification email in alert
      setTimeout(() => {
        const verifyUrl = `${location.origin}/account/verify-email?token=${account.verificationToken}`;
        alertService.info(`
                    <h4>Verification Email</h4>
                    <p>Thanks for registering!</p>
                    <p>Please click the below link to verify your email address:</p>
                    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
                    <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>
                `, {autoClose: false});
      }, 1000);

      return ok();
    }

    function getAccounts() {
      if (!isAuthenticated()) {
        return unauthorized();
      }
      return ok(accounts.map(x => basicDetails(x)));
    }

    function getAccountById() {
      if (!isAuthenticated()) {
        return unauthorized();
      }

      const account = accounts.find(x => x.id === idFromUrl());

      // user accounts can get own profile and admin accounts can get all profiles
      if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
        return unauthorized();
      }

      return ok(basicDetails(account));
    }

    function createAccount() {
      // if (!isAuthorized(Role.Admin)) {
      //   return unauthorized();
      // }

      const account = body;
      if (accounts.find(x => x.email === account.email)) {
        return error(`Email ${account.email} is already registered`);
      }

      account.id = newAccountId();
      account.dateCreated = new Date().toISOString();
      account.isVerified = true;
      account.refreshTokens = [];
      delete account.confirmPassword;
      accounts.push(account);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok();
    }

    function updateAccount() {
      if (!isAuthenticated()) {
        return unauthorized();
      }

      const params = body;
      const account = accounts.find(x => x.id === idFromUrl());

      // user accounts can update own profile and admin accounts can update all profiles
      if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
        return unauthorized();
      }

      if (!params.password) {
        delete params.password;
      }
      delete params.confirmPassword;

      Object.assign(account, params);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok(basicDetails(account));
    }

    function getEmployees() {
      if (!isAuthenticated()) {
        return unauthorized();
      }

      db.getAll('employees').toPromise()
        .then((res: any) => {
          if (res.length === 0) {
            let employees: any[] = [];

            this.http.get('/assets/generated.json').toPromise()
              .then((data: any) => {
                employees = data;
                return db.add('employees', employees).toPromise();
              }).catch(err => error('json file error:' + err))
              .then(() => ok(employees));
          } else {
            return ok(res);
          }
        })
        .catch(err => {
          error('db error:' + err);
        });
    }

    // helper functions

    function ok(reqBody?) {
      return of(new HttpResponse({status: 200, body: reqBody}))
        .pipe(delay(500)); // delay observable to simulate server api call
    }

    function error(message) {
      // call materialize and dematerialize to ensure delay even if an error is thrown
      return throwError({error: {message}})
        .pipe(materialize(), delay(500), dematerialize());
    }

    function unauthorized() {
      return throwError({status: 401, error: {message: 'Unauthorized'}})
        .pipe(materialize(), delay(500), dematerialize());
    }

    function basicDetails(account) {
      const {id, title, firstName, lastName, email, role, dateCreated, isVerified} = account;
      return {id, title, firstName, lastName, email, role, dateCreated, isVerified};
    }

    function isAuthenticated() {
      return !!currentAccount();
    }

    function isAuthorized(role) {
      const account = currentAccount();
      if (!account) {
        return false;
      }
      return account.role === role;
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1], 10);
    }

    function newAccountId() {
      return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
    }

    function currentAccount() {
      // check if jwt token is in auth header
      const authHeader = headers.get('Authorization');
      if (!authHeader.startsWith('Bearer fake-jwt-token')) {
        return;
      }

      // check if token is expired
      const jwtToken = JSON.parse(atob(authHeader.split('.')[1]));
      const tokenExpired = Date.now() > (jwtToken.exp * 1000);
      if (tokenExpired) {
        return;
      }

      const account = accounts.find(x => x.id === jwtToken.id);
      return account;
    }

    function generateJwtToken(account) {
      // create token that expires in 15 minutes
      const tokenPayload = {
        exp: Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000),
        id: account.id
      };
      return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
    }

    function generateRefreshToken() {
      const token = new Date().getTime().toString();

      // add token cookie that expires in 7 days
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;

      return token;
    }

    function getRefreshToken() {
      // get refresh token from cookie
      return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
    }
  }
}

export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
