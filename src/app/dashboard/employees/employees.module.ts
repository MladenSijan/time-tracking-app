import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {ChartsModule} from 'ng2-charts';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {PaginatorComponent} from './employees-container/paginator/paginator.component';
import {EmployeeOverviewComponent} from './employee-overview/employee-overview.component';
import {EmployeeInfoComponent} from './employee-overview/employee-info/employee-info.component';
import {EmployeesContainerComponent} from './employees-container/employees-container.component';
import {ActivityGraphComponent} from './employee-overview/activity-graph/activity-graph.component';
import {EmployeesTableComponent} from './employees-container/employees-table/employees-table.component';

@NgModule({
  declarations: [
    PaginatorComponent,
    EmployeeInfoComponent,
    ActivityGraphComponent,
    EmployeesTableComponent,
    EmployeeOverviewComponent,
    EmployeesContainerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,

    ChartsModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSlideToggleModule,
  ],
  exports: [
    EmployeesContainerComponent
  ]
})
export class EmployeesModule {
}
