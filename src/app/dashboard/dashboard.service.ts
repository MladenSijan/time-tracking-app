import {Injectable} from '@angular/core';
import {LoaderService} from '../shared/loader/loader.service';
import {EmployeesService, FilterParams} from './employees/employees.service';
import {Employee} from './models/employee';
import {Summary} from './models/summary';
import {
  totalClockedInTimeReducer,
  totalProductiveTimeReducer,
  totalUnproductiveTimeReducer,
} from '../helpers';
import {HttpClient} from '@angular/common/http';
import {DashboardServiceModule} from './dashboard-service.module';

@Injectable({providedIn: DashboardServiceModule})
export class DashboardService {
  summaryInfo: Summary = {
    productiveTime: 0,
    clockedInTime: 0,
    unproductiveTime: 0,
    total: 0
  };

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
      productiveTime: employees.reduce(totalProductiveTimeReducer, 0),
      unproductiveTime: employees.reduce(totalUnproductiveTimeReducer, 0)
    };
  }

  public updateFilter(params: FilterParams): void {
    this.employees.updateFilterParams(params);
  }
}
