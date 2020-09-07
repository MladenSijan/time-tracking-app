import {Injectable} from '@angular/core';
import {DashboardServiceModule} from './dashboard-service.module';
import {LoaderService} from '../shared/loader/loader.service';
import {EmployeesService, FilterParams} from './employees/employees.service';
import {Employee} from './models/employee';
import {Summary} from './models/summary';
import {productiveTimeReducer, totalClockedInTimeReducer, unproductiveTimeReducer} from '../helpers';

@Injectable({providedIn: DashboardServiceModule})
export class DashboardService {
  summaryInfo: Summary = null;

  constructor(
    private loader: LoaderService,
    private employees: EmployeesService,
  ) {
  }

  public getSummary(): void {
    this.loader.loading$.next(true);
    this.employees.requestForEmployees().toPromise()
      .then(data => {
        this.setSummaryInfo(data || []);
        this.loader.loading$.next(false);
      });
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
}
