import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {
  @Output() pageChange = new EventEmitter<number>();
  config: any = {
    length: 0,
    size: 0,
    index: 0
  };

  @Input('config') set configSetter(config: any) {
    const {length, size, index} = config;
    this.config = {...length, size, index};
  }

  onChange(e): void {
    console.log(e);
    this.pageChange.emit(e);
  }
}
