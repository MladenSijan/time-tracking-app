import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {ChartsModule} from 'ng2-charts';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {SharedModule} from '../../shared/shared.module';

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
    ReactiveFormsModule,

    SharedModule,

    ChartsModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSlideToggleModule,
  ],
  exports: [
    EmployeesContainerComponent
  ],
  providers: [
  ]
})
export class EmployeesModule {
}
