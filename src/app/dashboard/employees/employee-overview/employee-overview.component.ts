import {Component, OnInit} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {EmployeesService} from '../employees.service';

@Component({
  selector: 'app-employee-overview',
  templateUrl: './employee-overview.component.html',
  styleUrls: ['./employee-overview.component.scss']
})
export class EmployeeOverviewComponent implements OnInit {

  constructor(
    public employees: EmployeesService
  ) {
  }

  ngOnInit(): void {
  }

  onAddTrack(e) {
    this.employees.addTrack('', '');
  }

  onToggleStatus(e: MatSlideToggleChange): void {
    this.employees.changeStatus(e.checked);
  }
}
