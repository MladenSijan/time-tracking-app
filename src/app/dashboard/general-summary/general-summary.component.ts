import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Summary} from '../models/summary';

@Component({
  selector: 'app-general-summary',
  templateUrl: './general-summary.component.html',
  styleUrls: ['./general-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralSummaryComponent {
  @Input() summary: Summary = null;
}
