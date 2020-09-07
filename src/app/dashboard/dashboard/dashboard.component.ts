import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardService} from '../dashboard.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();

  constructor(
    public dashboard: DashboardService
  ) {
  }

  ngOnInit(): void {
    this.dashboard.getSummary();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onDateChange(range): void {
    const {from, to} = range;
    this.dashboard.updateFilter({from, to});
  }

  onSearch(searchTerm: string): void {
    this.dashboard.updateFilter({searchTerm});
  }

  onStatusChange(active: boolean): void {
    this.dashboard.updateFilter({active});
  }
}
