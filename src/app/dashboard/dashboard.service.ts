import {Injectable} from '@angular/core';
import {DashboardServiceModule} from './dashboard-service.module';
import {LoaderService} from '../shared/loader/loader.service';
import {EmployeesService, FilterParams} from './employees/employees.service';
import {Employee} from './models/employee';
import {Summary} from './models/summary';
import {Subject} from 'rxjs';

@Injectable({providedIn: DashboardServiceModule})
export class DashboardService {
  summaryInfo: Summary = null;

  private filterChange = new Subject<FilterParams>();
  public filterChange$ = this.filterChange.asObservable();

  constructor(
    private loader: LoaderService,
    private employees: EmployeesService,
  ) {
  }

  public getSummary(): void {
    this.loader.loading$.next(true);
    this.employees.getEmployees()
      .then(data => this.getSummaryInfo(data || []))
      .then(() => this.loader.loading$.next(false));
  }

  private getSummaryInfo(employees: Employee[]): void {
    this.summaryInfo = {
      total: employees.length || 0,
      clockedInTime: 0,
      productiveTime: 0,
      unproductiveTime: 0
    };
  }

  public updateFilter(params: FilterParams): void {
    this.filterChange.next(params);
  }

  public applyFilter(filter): void {
    this.employees.updateFilterParams(filter);
  }
}
