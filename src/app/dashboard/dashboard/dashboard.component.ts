import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardService} from '../dashboard.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();

  constructor(
    public dashboard: DashboardService
  ) {
  }

  ngOnInit(): void {
    this.dashboard.getSummary();

    this.dashboard.filterChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filter => this.dashboard.applyFilter(filter));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onDateChange(range) {
    const {from, to} = range;
    this.dashboard.updateFilter({from, to});
  }

  onPageChange(page: number, offset) {
    this.dashboard.updateFilter({page, offset});
  }

  onSearch(searchTerm: string): void {
    this.dashboard.updateFilter({searchTerm});
  }

  onStatusChange(active: boolean) {
    this.dashboard.updateFilter({active});
  }
}
