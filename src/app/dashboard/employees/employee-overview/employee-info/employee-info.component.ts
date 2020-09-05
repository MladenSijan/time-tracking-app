import {Component, Input, OnInit} from '@angular/core';
import {Employee} from '../../../models/employee';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss']
})
export class EmployeeInfoComponent implements OnInit {
  @Input() employee: Employee = null;

  ngOnInit(): void {
  }
}
