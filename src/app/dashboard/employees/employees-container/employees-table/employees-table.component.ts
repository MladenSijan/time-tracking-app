import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Employee} from '../../../models/employee';
import {Router} from '@angular/router';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesTableComponent {
  displayedColumns = ['name', 'status', 'actions'];
  @Input() employees: Employee[] = null;

  constructor(
    private router: Router
  ) {
  }

  onRowSelect(): void {
    this.router.navigate(['employee', 1]);
  }
}
