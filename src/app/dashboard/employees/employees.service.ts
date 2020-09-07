import {Injectable} from '@angular/core';
import {LoaderService} from '../../shared/loader/loader.service';
import {DashboardServiceModule} from '../dashboard-service.module';
import {Employee} from '../models/employee';
import {RequestsService} from '../../shared/requests.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {PaginatorConfig} from './employees-container/paginator/paginator.component';
import {shareReplay, tap} from 'rxjs/operators';

export interface FilterParams {
  to?: string;
  from?: string;
  limit?: number;
  offset?: number;
  active?: boolean;
  searchTerm?: string;
}

@Injectable({providedIn: DashboardServiceModule})
export class EmployeesService {
  private employees: Employee[] = null;
  employeeInfo: Employee = null;

  employees$ = new Subject<Employee[]>();

  paginatorConfig: PaginatorConfig = {
    size: 0,
    index: 0,
    length: 0
  };

  filterParams: FilterParams = {
    limit: 20,
    offset: 0,
    active: true,
    searchTerm: '',
    to: '2020-09-05 ',
    from: '2020-09-01 '
  };

  constructor(
    private http: HttpClient,
    private loader: LoaderService,
    private snackbar: MatSnackBar,
    private requests: RequestsService
  ) {
  }

  private onChange(): void {
    this.loader.loading$.next(true);
    this.employees$.next(this._filter(this.employees || []));
    this.loader.loading$.next(false);
  }

  private setEmployees(res): void {
    this.employees = res.map((emp: any) => ({
      ...emp,
      active: Math.random() > 0.5,
    }));

    this.employees$.next(this._filter(this.employees));
  }

  public requestForEmployees(): Observable<any> {
    this.loader.loading$.next(true);
    return this.http.get('/assets/generated.json')
      .pipe(shareReplay(), tap(res => this.setEmployees(res)));
  }

  public updateFilterParams(params: any): void {
    this.filterParams = {...this.filterParams, ...params};
    this.onChange();
  }

  public changeStatus(active: boolean): void {
    this._requestForUpdate({...this.employeeInfo, active});
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

    const modifiedData: any[] = data.slice(this.filterParams.offset, this.filterParams.offset + size + 1);
    return modifiedData.map((emp: any, i) => ({
      ...emp,
      activities: [`${emp.guid.slice(0, 4)}-1`, `${emp.guid.slice(0, 4)}-2`, `${emp.guid.slice(0, 4)}-3`]
    }));
  }

  private _showInfo(message: string): void {
    this.snackbar.open(message, null, {duration: 1500});
  }
}
