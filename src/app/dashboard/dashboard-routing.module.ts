import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {PlaceholderComponent} from '../shared/placeholder/placeholder.component';
import {EmployeeOverviewComponent} from './employees/employee-overview/employee-overview.component';

const routes: Routes = [
  {
    path: '',
    component: PlaceholderComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'employee/:id',
        component: EmployeeOverviewComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
