import {Injectable} from '@angular/core';
import {LoaderService} from '../../shared/loader/loader.service';
import {DashboardServiceModule} from '../dashboard-service.module';
import {Employee} from '../models/employee';
import {RequestsService} from '../../shared/requests.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';

export interface FilterParams {
  active?: boolean;
  from?: string;
  to?: string;
  searchTerm?: string;
  page?: number;
  offset?: number;
  pageSize?: number;
}

@Injectable({providedIn: DashboardServiceModule})
export class EmployeesService {
  employees: Employee[] = null;
  employeeInfo: Employee = null;

  filterParams: FilterParams = {
    active: true,
    from: '2020-09-01 ',
    to: '2020-09-05 ',
    searchTerm: '',
    page: 0,
    offset: 0,
    pageSize: 5
  };

  constructor(
    private http: HttpClient,
    private loader: LoaderService,
    private snackbar: MatSnackBar,
    private requests: RequestsService
  ) {
  }

  public getEmployees(): Promise<any> {
    return this.http.get('/assets/generated.json').toPromise()
      .then((res: any[]) => {

        // adapt data
      });
  }

  async setFilterParams(params: any): Promise<FilterParams> {
    this.filterParams = {...this.filterParams, ...{}};
    return this.filterParams;
  }

  updateFilterParams(params: any): void {
    this.filterParams = {...this.filterParams, ...params};
    this.getEmployees();
  }

  public changeStatus(active: boolean): void {
    this.requestForUpdate({...this.employeeInfo, active});
  }

  private requestForUpdate(employee: Employee): void {
    this.requests.updateData(`/users/${employee.id}`, employee).toPromise()
      .then(res => {
        this.employeeInfo = {...employee};
        this.showInfo('update successful');
      })
      .catch(err => this.showInfo('update failed: ' + err));
  }

  showInfo(message: string): void {
    this.snackbar.open(message, null, {duration: 1500});
  }

  private _filter(res: Employee[]): Employee[] {
    let data = res;

    if (this.filterParams.searchTerm.length > 0) {
      data = data.filter(option => option.name.toLowerCase().includes(this.filterParams.searchTerm));
    }

    data.slice(this.filterParams.offset, this.filterParams.page * this.filterParams.pageSize + 1);

    return data;
  }
}
