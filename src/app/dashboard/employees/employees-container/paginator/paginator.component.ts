import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

export interface PaginatorConfig {
  size: number;
  index: number;
  length: number;
}

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {
  config: PaginatorConfig = {
    size: 0,
    index: 0,
    length: 0
  };
  @Output() pageChange = new EventEmitter<number>();

  @Input('config') set configSetter(config: any) {
    const {length, size, index} = config;
    this.config = {...this.config, length, size, index};
  }

  onChange(e): void {
    this.pageChange.emit(e.pageIndex);
  }
}
