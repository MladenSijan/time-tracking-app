import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {UserAccount} from '../models';

const baseUrl = `${environment.apiUrl}/oauth`;

@Injectable({providedIn: 'root'})
export class AccountService {
  private accountSubject: BehaviorSubject<UserAccount>;
  public account: Observable<UserAccount>;

  private refreshTokenTimeout;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.accountSubject = new BehaviorSubject<UserAccount>(null);
    this.account = this.accountSubject.asObservable();
  }

  public get accountValue(): UserAccount {
    return this.accountSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${baseUrl}/authenticate`, {email, password}, {withCredentials: true})
      .pipe(map(account => {
        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
        return account;
      }));
  }

  logout() {
    this.http.post<any>(`${baseUrl}/revoke-token`, {}, {withCredentials: true}).subscribe();
    this.stopRefreshTokenTimer();
    this.accountSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken() {
    return this.http.post<any>(`${baseUrl}/refresh-token`, {}, {withCredentials: true})
      .pipe(map((account) => {
        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
        return account;
      }));
  }

  register(account: UserAccount) {
    return this.http.post(`${baseUrl}/register`, account);
  }

  getById(id: string) {
    return this.http.get<UserAccount>(`${baseUrl}/${id}`);
  }

  create(params) {
    return this.http.post(baseUrl, params);
  }

  update(id, params) {
    return this.http.put(`${baseUrl}/${id}`, params)
      .pipe(map((account: any) => {
        // update the current account if it was updated
        if (account.id === this.accountValue.id) {
          // publish updated account to subscribers
          account = {...this.accountValue, ...account};
          this.accountSubject.next(account);
        }
        return account;
      }));
  }

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
