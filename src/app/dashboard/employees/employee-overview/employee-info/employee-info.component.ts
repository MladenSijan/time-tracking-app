import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Employee} from '../../../models/employee';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeInfoComponent {
  @Input() employee: Employee = null;
}
