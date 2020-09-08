import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {transform} from '../../../helpers';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangePickerComponent implements OnChanges {
  date = new Date();
  startHours = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
    '23:59'
  ];
  endHours = [...this.startHours];
  minDateTo = new Date();
  range: { from: string, to: string };
  dateRangeForm = new FormGroup({
    startDate: new FormControl(this.date),
    endDate: new FormControl(this.date),
    startTime: new FormControl('00:00'),
    endTime: new FormControl('23:59'),
  });

  @Input() hasTimePicker = true;
  @Input() from: string | Date = this.date;
  @Input() to: string | Date = this.date;
  @Input() minDate: string | Date = new Date(this.date.getFullYear(), 0, 1);
  @Input() maxDate: string | Date = new Date();
  @Output() rangeChanges: EventEmitter<any> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.from) {
      this.from = changes.from.currentValue as string;
      this.dateRangeForm.get('startDate').setValue(new Date(this.from.split(' ')[0]));
      this.dateRangeForm.get('startTime').setValue(this.from.split(' ')[1]);
      this.minDateTo = this.dateRangeForm.get('startDate').value;
    }

    if (changes.to) {
      this.to = changes.to.currentValue as string;
      this.dateRangeForm.get('endDate').setValue(new Date(this.to.split(' ')[0]));
      this.dateRangeForm.get('endTime').setValue(this.to.split(' ')[1]);
    }

    if (changes.minDate) {
      this.minDate = changes.minDate.currentValue as string;
    }

    if (changes.maxDate) {
      this.maxDate = changes.maxDate.currentValue as string;
    }

    if (changes.hasTimePicker) {
      this.hasTimePicker = changes.hasTimePicker.currentValue;
      if (this.hasTimePicker) {
        this.dateRangeForm.get('startTime').setValue('00:00');
        this.dateRangeForm.get('endTime').setValue('23:59');
      }
    }
  }

  setRange(): void {
    const start = this.dateRangeForm.get('startDate').value;
    const startTime = this.dateRangeForm.get('startTime');
    const end = this.dateRangeForm.get('endDate').value;
    const endTime = this.dateRangeForm.get('endTime');

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const startDate = transform(start);
    let endDate = transform(end);

    this.minDateTo = new Date(startDate);

    if (+start >= +end) {
      this.dateRangeForm.get('endDate').setValue(start);
      endDate = startDate;

      if (this.hasTimePicker &&
        this.startHours.indexOf(startTime.value) >= this.startHours.indexOf(endTime.value)) {
        endTime.setValue('23:59');
      }
    }

    this.range = {
      from: `${startDate}${this.hasTimePicker ? ' ' + startTime.value : ''}`,
      to: `${endDate}${this.hasTimePicker ? ' ' + endTime.value : ''}`,
    };
    this.rangeChanges.emit(this.range);
  }
}
