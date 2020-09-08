import {Component, OnInit} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {EmployeesService} from '../employees.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-employee-overview',
  templateUrl: './employee-overview.component.html',
  styleUrls: ['./employee-overview.component.scss']
})
export class EmployeeOverviewComponent implements OnInit {
  maxValue = 12;
  totalHoursProductive = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  totalHoursUnproductive = [...this.totalHoursProductive];

  activityForm = new FormGroup({
    date: new FormControl(moment().format('YYYY-MM-DD'), [Validators.required]),
    clockedIn: new FormControl({value: 0}, [Validators.required]),
    clockedOut: new FormControl({value: 0, disabled: true}, [Validators.required]),
    productiveTime: new FormControl({value: 0, disabled: true}, [Validators.required]),
    unproductiveTime: new FormControl({value: 0, disabled: true}, [Validators.required]),
  });

  constructor(
    public employees: EmployeesService
  ) {
  }

  ngOnInit(): void {
  }

  onAddTrack() {
    if (this.activityForm.valid) {
      this.employees.addTrack('', '');
    } else {

    }
  }

  onDateChange(e) {

  }

  onClockedInChange(e: MatSelectChange) {
    this.activityForm.enable();
  }

  onProductiveChange(e: MatSelectChange) {
    const prodValue = +e;
    const count = this.maxValue = this.activityForm.get('clockedIn').value - prodValue;
    this.totalHoursUnproductive = [...this.totalHoursProductive.slice(0, count + 1)];
    this.activityForm.get('unproductiveTime').setValue(0);
  }

  onReset() {
    this.activityForm.reset();
    this.activityForm.disable();
    this.activityForm.get('date').enable();
    this.activityForm.get('clockedIn').enable();
    this.activityForm.get('date').setValue(moment().format('YYYY-MM-DD'));
  }

  onToggleStatus(e: MatSlideToggleChange): void {
    this.employees.changeStatus(e.checked);
  }
}
