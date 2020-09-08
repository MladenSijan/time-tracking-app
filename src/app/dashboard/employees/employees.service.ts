import {Injectable, SkipSelf} from '@angular/core';
import {LoaderService} from '../../shared/loader/loader.service';
import {DashboardServiceModule} from '../dashboard-service.module';
import {Employee} from '../models/employee';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {PaginatorConfig} from './employees-container/paginator/paginator.component';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {RequestsService} from '../../services';
import {environment} from '../../../environments/environment';

export interface FilterParams {
  to?: string;
  from?: string;
  limit?: number;
  offset?: number;
  active?: boolean;
  searchTerm?: string;
}

const baseUrl = `${environment.apiUrl}/users`;

@Injectable({providedIn: DashboardServiceModule})
export class EmployeesService {
  private employees: Employee[] = null;
  employeeInfo: Employee = {
    totalClockedInTime: 2,
    totalUnproductiveTime: 2,
    active: true,
    id: 'u2313',
    name: 'Client name',
    productivityRatio: 0.4,
    totalProductiveTime: 2
  };

  employees$ = new Subject<Employee[]>();

  paginatorConfig: PaginatorConfig = {
    size: 0,
    index: 0,
    length: 0
  };

  filterParams: FilterParams = {
    limit: 50,
    offset: 0,
    active: true,
    searchTerm: '',
    to: '2020-09-05 ',
    from: '2020-09-01 '
  };

  constructor(
    private db: NgxIndexedDBService,
    private http: HttpClient,
    private loader: LoaderService,
    private snackbar: MatSnackBar,
    private requests: RequestsService
  ) {
  }

  private onChange(): void {
    this.employees$.next(this._filter(this.employees || []));
  }

  public getAll(): Promise<any> {
    return this._requestForEmployees();
  }

  public getSingle(): Promise<any> {
    return this._requestForEmployees();
  }

  private _requestForEmployees(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(baseUrl, {withCredentials: true}).toPromise()
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  public setEmployees(res): void {
    this.employees = res.map((emp: any) => ({
      ...emp,
      active: Math.random() > 0.5,
    }));
    this.employees$.next(this._filter(this.employees));
  }

  public updateFilterParams(params: any): void {
    this.filterParams = {...this.filterParams, ...params};
    this.onChange();
  }

  public changeStatus(active: boolean): void {
    this._requestForUpdate({...this.employeeInfo, active});
  }

  public addTrack(id, track): void {

  }

  private _requestForUpdate(employee: Employee): void {
    this.requests.updateData(`/users/${employee.id}`, employee).toPromise()
      .then(res => {
        this.employeeInfo = {...employee};
        this._showInfo('Update successful');
      })
      .catch(err => this._showInfo('Update failed: ' + err));
  }

  private _filter(res: Employee[]): Employee[] {
    let data: any = res;
    const shouldIncludeSearch = this.filterParams.searchTerm.length > 0;

    if (shouldIncludeSearch) {
      data = data.filter(option => {
        return (this.filterParams.active === option.active) && option.guid.toLowerCase().includes(this.filterParams.searchTerm);
      });
    } else {
      data = data.filter(option => {
        const inRange = true;
        return (this.filterParams.active === option.active) && inRange;
      });
    }

    const total = data.length;
    const size = total < this.filterParams.limit ? total : this.filterParams.limit;

    this.paginatorConfig = {
      ...this.paginatorConfig,
      size,
      length: total,
      index: this.filterParams.offset / this.filterParams.limit,
    };

    return data.slice(this.filterParams.offset, this.filterParams.offset + size + 1);
  }

  private _showInfo(message: string): void {
    this.snackbar.open(message, null, {duration: 1500});
  }
}
