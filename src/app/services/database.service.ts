import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {from, Observable, of, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, switchMap, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DatabaseService {

  constructor(
    private http: HttpClient,
    private db: NgxIndexedDBService,
  ) {
  }

  add(storeName: string, data: any): Observable<any> {
    return this.db.add(storeName, data);
  }

  getAll(storeName: string): Observable<any> {
    return from(this.db.getAll(storeName)).pipe(
      switchMap(data => {
        if (data && data.length && data.length > 0) {
          return of(data[0]);
        } else {
          return this.http.get('/assets/generated.json')
            .pipe(tap((res) => this.db.add('employees', res)));
        }
      }),
      catchError(err => throwError(err))
    );
  }

  getSingle(storeName: string, key: string): Observable<any> {
    return this.db.getByKey(storeName, key);
  }
}
