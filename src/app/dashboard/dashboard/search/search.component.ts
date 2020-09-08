import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {fromEvent, Subject} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements AfterViewInit, OnDestroy {
  @Output() valueChange = new EventEmitter<string>();

  searchControl: FormControl = new FormControl('');
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;

  destroy$: Subject<boolean> = new Subject();

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((ev: any) => this.valueChange.emit(ev.target.value));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onReset(): void {
    this.searchControl.reset();
    this.searchControl.setValue('');
    this.valueChange.emit('');
  }
}
