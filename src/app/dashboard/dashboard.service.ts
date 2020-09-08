import {Injectable} from '@angular/core';
import {LoaderService} from '../shared/loader/loader.service';
import {EmployeesService, FilterParams} from './employees/employees.service';
import {Employee} from './models/employee';
import {Summary} from './models/summary';
import {productiveTimeReducer, totalClockedInTimeReducer, unproductiveTimeReducer} from '../helpers';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DashboardServiceModule} from './dashboard-service.module';

const baseUrl = `${environment.apiUrl}/users`;

@Injectable({providedIn: DashboardServiceModule})
export class DashboardService {
  summaryInfo: Summary = null;

  constructor(
    private http: HttpClient,
    private loader: LoaderService,
    private employees: EmployeesService,
  ) {
  }

  public getSummary(): void {
    this.loader.loading$.next(true);

    this.employees.getAll()
      .then(data => {
        this.employees.setEmployees(data);
        this.setSummaryInfo(data || []);
      })
      .finally(() => this.loader.loading$.next(false));
  }

  private setSummaryInfo(employees: Employee[]): void {
    this.summaryInfo = {
      total: employees.length || 0,
      clockedInTime: employees.reduce(totalClockedInTimeReducer, 0),
      productiveTime: employees.reduce(productiveTimeReducer, 0),
      unproductiveTime: employees.reduce(unproductiveTimeReducer, 0)
    };
  }

  public updateFilter(params: FilterParams): void {
    this.employees.updateFilterParams(params);
  }

  private _requestForEmployees(): Promise<any> {
    return new Promise((resolve) => {
      this.http.get(baseUrl, {withCredentials: true}).toPromise()
        .then(res => {
          console.log('success', res);
          resolve(res);
        })
        .catch(err => {
          console.log('req err', err);
        });
    });
  }
}
