import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Label} from 'ng2-charts';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';

@Component({
  selector: 'app-activity-graph',
  templateUrl: './activity-graph.component.html',
  styleUrls: ['./activity-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityGraphComponent implements OnInit {
  @Input() data: any = null;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        // {stacked: true}
      ]
    }
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], stack: 'a', label: 'Series A'},
    {data: [35, 29, 50, 11, 56, 25, 10], stack: 'a', label: 'Series A'},
  ];

  constructor() {
  }

  ngOnInit(): void {
  }
}
