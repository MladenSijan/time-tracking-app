import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DatabaseService {

  constructor(
    private db: NgxIndexedDBService,
  ) {
  }

  add(storeName: string, data: any): Observable<any> {
    return this.db.add(storeName, data);
  }

  getAll(storeName: string): Observable<any> {
    return this.db.getAll(storeName);
  }

  getSingle(storeName: string, key: string): Observable<any> {
    return this.db.getByKey(storeName, key);
  }
}
