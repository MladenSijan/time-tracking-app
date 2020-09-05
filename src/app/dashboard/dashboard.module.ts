import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';

import {SharedModule} from '../shared/shared.module';
import {EmployeesModule} from './employees/employees.module';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardServiceModule} from './dashboard-service.module';

import {DashboardComponent} from './dashboard/dashboard.component';
import {SearchComponent} from './dashboard/search/search.component';
import {GeneralSummaryComponent} from './general-summary/general-summary.component';
import {DateRangePickerComponent} from './dashboard/date-range-picker/date-range-picker.component';

@NgModule({
  declarations: [
    SearchComponent,
    DashboardComponent,
    GeneralSummaryComponent,
    DateRangePickerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,

    SharedModule,
    EmployeesModule,
    DashboardServiceModule,
    DashboardRoutingModule,
  ]
})
export class DashboardModule {
}
