import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Employee} from '../../../models/employee';
import {Router} from '@angular/router';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesTableComponent implements OnInit {
  displayedColumns = ['name', 'actions'];
  @Input() employees: Employee[] = null;

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  onRowSelect(): void {
    this.router.navigate([]);
  }
}
