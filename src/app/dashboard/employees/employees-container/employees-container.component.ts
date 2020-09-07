import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmployeesService} from '../employees.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-employees-container',
  templateUrl: './employees-container.component.html',
  styleUrls: ['./employees-container.component.scss'],
})
export class EmployeesContainerComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();

  constructor(
    public employees: EmployeesService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onPageChange(page: number): void {
    const offset = page * this.employees.paginatorConfig.size;
    this.employees.updateFilterParams({offset});
  }
}
