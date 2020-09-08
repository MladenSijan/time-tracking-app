import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Label} from 'ng2-charts';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-activity-graph',
  templateUrl: './activity-graph.component.html',
  styleUrls: ['./activity-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityGraphComponent implements OnInit {
  @Input() data: any = null;
  dates = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          type: 'time',
          ticks: {
            min: '2020-09-01',
            max: '2020-09-26'
          }
        }
      ]
    },
    legend: {
      align: 'center',
      labels: {

      }
    },
    tooltips: {
      custom: (d) => {}
    }
  };
  public barChartLabels: Label[] = []; // should be resolved dynamically
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    {data: [2, 5, 5, 6, 7, 6, 8], stack: 'a', label: 'Productive'},
    {data: [4, 7, 2, 1, 4, 2, 1], stack: 'a', label: 'Unproductive'},
    {data: [4, 0, 1, 2, 1, 1, 0], stack: 'a', label: 'Neutral'},
  ];

  constructor() {
    for (let i = 0; i < 25; i++) {
      this.dates.push(moment('2020-09-01').add(i, 'days').format('ll'));
    }
  }

  ngOnInit(): void {
    this.barChartLabels = [...this.dates];
  }
}
