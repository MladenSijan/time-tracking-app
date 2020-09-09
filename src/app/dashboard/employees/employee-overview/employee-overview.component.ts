import {Component, OnInit} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {EmployeesService} from '../employees.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {MatSelectChange} from '@angular/material/select';
import {randomDate} from '../../../helpers';

@Component({
  selector: 'app-employee-overview',
  templateUrl: './employee-overview.component.html',
  styleUrls: ['./employee-overview.component.scss']
})
export class EmployeeOverviewComponent implements OnInit {
  maxValue = 12;
  totalHoursProductive = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  totalHoursUnproductive = [...this.totalHoursProductive];
  now = moment().format('LT');
  maxClockedIn = null;
  minClockedOut = null;
  activities = [];

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
    this.activities = this.getActivities().map(act => {
      // delete act.to;
      return {...act};
    });
    // console.log(getRanges(res, '2020-06-01', '2020-09-03'));
  }

  getActivities() {
    const a = [];
    for (let i = 0; i < 75; i++) {
      const startMonth = Math.floor(Math.random() * (6 - 1) + 1);
      const endMonth = Math.floor(Math.random() * (10 - (startMonth - 1)) + (startMonth - 1));

      const start = Math.floor(Math.random() * (28 - 1) + 1);
      const end = Math.floor(Math.random() * (28 - (start - 1)) + (start - 1));

      const formattedStart = moment().month(startMonth).date(start).toDate();
      const formattedEnd = moment().month(endMonth).date(end).toDate();

      const randomDateFromRange = randomDate(formattedStart, formattedEnd);

      const clockedIn = Math.floor(Math.random() * (24 - 10) + 10);
      const clockedOut = Math.floor(Math.random() * (24 - clockedIn) + clockedIn);

      const total = clockedOut - clockedIn;

      const productive = Math.floor(Math.random() * (total - 1) + 1);

      const left = total - productive;
      const unproductive = Math.floor(Math.random() * (left - 1) + 1);

      a.push({
        clockedIn: moment().hours(clockedIn).format('LT'),
        clockedOut: moment().hours(clockedOut).format('LT'),
        productiveTime: productive,
        unproductiveTime: unproductive,
        neutral: total - (unproductive + productive),
        date: randomDateFromRange,
        // to: randomDate(moment(from).toDate(), moment().toDate()),
      });
    }

    return a;
  }

  onAddTrack() {
    if (this.activityForm.valid) {
      this.employees.addTrack('', '');
    } else {

    }
  }

  onDateChange(e) {

  }

  onClockedInChange(e) {
  }

  onClockedInSet(e) {
    this.minClockedOut = e;
  }

  onClockedOutSet(e) {
    this.totalHoursUnproductive = Array.from([], () => 2);
  }

  onClockedOutChange(e) {
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
