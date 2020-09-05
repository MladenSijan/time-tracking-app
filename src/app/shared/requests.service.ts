import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RequestsService {

  constructor() {
  }

  getData(key, params?): Observable<any> {
    const data = localStorage.getItem(key);
    if (data === undefined) {
      throwError('not found');
    } else {
      return of(data);
    }
  }

  postData(key, data): Observable<any> {
    try {
      const existing = localStorage.getItem(key) || {};
      const updated = {...existing, ...data};
      JSON.stringify(updated);
      localStorage.setItem(key, data);
      return of(null);
    } catch (e) {
      return throwError('error: ' + e);
    }
  }

  updateData(key, data): Observable<any> {
    try {
      const existing = localStorage.getItem(key) || {};
      const updated = {...existing, ...data};
      JSON.stringify(updated);
      localStorage.setItem(key, data);
      return of(null);
    } catch (e) {
      return throwError('error: ' + e);
    }
  }
}
