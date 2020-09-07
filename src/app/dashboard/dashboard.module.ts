import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {APP_DATE_FORMATS, MaterialDateAdapter} from '../helpers';
import {DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule} from '@angular/material/core';

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
    MatSelectModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,

    SharedModule,
    EmployeesModule,
    DashboardServiceModule,
    DashboardRoutingModule,
  ],
  providers: [
    {provide: DateAdapter, useClass: MaterialDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class DashboardModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
  }
}
