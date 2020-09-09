import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Color, Label} from 'ng2-charts';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import * as moment from 'moment';
import {sortArray} from '../../../../helpers';

@Component({
  selector: 'app-activity-graph',
  templateUrl: './activity-graph.component.html',
  styleUrls: ['./activity-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityGraphComponent implements OnInit {
  @Input() data: any = null;
  dates = [];

  public barChartOptions: ChartOptions = null;
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartColors: Color[] = [
    {backgroundColor: '#17cfcf'},
    {backgroundColor: '#ff506d'},
    {backgroundColor: '#a29bfe'},
  ];
  public barChartData: ChartDataSets[] = [];

  @Input('data') set setData(data) {
    const sorted = sortArray([...data].map(d => d.from));
    this.data = data;

    this.barChartData = [
      {data: [...this.data].map(d => d.productiveTime), stack: 'a', label: 'Productive'},
      {data: [...this.data].map(d => d.unproductiveTime), stack: 'a', label: 'Unproductive'},
      {data: [...this.data].map(d => d.neutral), stack: 'a', label: 'Neutral'},
    ];

    this.barChartOptions = {
      responsive: true,
      scales: {
        xAxes: [
          {
            type: 'time',
            ticks: {
              min: sorted[0],
              max: sorted[sorted.length - 1]
            }
          }
        ]
      },
      legend: {align: 'center'},
      tooltips: {
        custom: (d) => {
        }
      },
    };

    this.barChartLabels = this.data.map((activity, i) => moment(activity.from).add(i, 'days').format('ll'));
  }

  constructor() {

  }

  ngOnInit(): void {
  }
}
