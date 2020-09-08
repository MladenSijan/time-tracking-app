import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, finalize} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {UserAccount} from '../models';

const baseUrl = `${environment.apiUrl}/accounts`;

@Injectable({providedIn: 'root'})
export class AuthService {
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

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${baseUrl}/authenticate`, {email, password}, {withCredentials: true})
      .pipe(map(account => {
        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
        return account;
      }));
  }

  logout(): void {
    this.http.post<any>(`${baseUrl}/revoke-token`, {}, {withCredentials: true}).subscribe();
    this.stopRefreshTokenTimer();
    this.accountSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${baseUrl}/refresh-token`, {}, {withCredentials: true})
      .pipe(map((account) => {
        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
        return account;
      }));
  }

  register(account: UserAccount): Observable<any> {
    return this.http.post(`${baseUrl}/register`, account);
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.post(`${baseUrl}/validate-reset-token`, {token});
  }

  resetPassword(token: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${baseUrl}/reset-password`, {token, password, confirmPassword});
  }

  getAll(): Observable<any> {
    return this.http.get<UserAccount[]>(baseUrl);
  }

  getById(id: string): Observable<any> {
    return this.http.get<UserAccount>(`${baseUrl}/${id}`);
  }

  create(params): Observable<any> {
    return this.http.post(baseUrl, params);
  }

  update(id, params): Observable<any> {
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

  delete(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`)
      .pipe(finalize(() => {
        // auto logout if the logged in account was deleted
        if (id === this.accountValue.id) {
          this.logout();
        }
      }));
  }

  // helper methods

  private startRefreshTokenTimer(): void {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }
}
