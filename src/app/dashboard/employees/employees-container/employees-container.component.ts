import { Component, OnInit } from '@angular/core';
import {EmployeesService} from '../employees.service';

@Component({
  selector: 'app-employees-container',
  templateUrl: './employees-container.component.html',
  styleUrls: ['./employees-container.component.scss']
})
export class EmployeesContainerComponent implements OnInit {

  constructor(
    public employees: EmployeesService
  ) { }

  ngOnInit(): void {
  }

}
