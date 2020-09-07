import {
  AfterContentInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {animate, keyframes, transition, trigger} from '@angular/animations';
import {takeUntil} from 'rxjs/operators';
import * as kf from '../../animations/keyframes';
import {Presets} from './loader.directive';
import {LoaderService} from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [
    trigger('fade', [
      transition('* => void', animate(500, keyframes(kf.fadeOut)))
    ])
  ]
})
export class LoaderComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('defaultPreset', {static: true}) defaultPreset: TemplateRef<any>;
  @ViewChild('loaderOutlet', {read: ViewContainerRef}) loaderOutlet: ViewContainerRef;

  zIndex = 1000;
  presets: any = {};
  chosenTemplate: Presets | TemplateRef<any>;

  isVisible = true;

  destroy$: Subject<boolean> = new Subject();

  constructor(public loader: LoaderService) {
  }

  ngOnInit(): void {
    this.loader.loading$.pipe(takeUntil(this.destroy$)).subscribe(isLoading => this.isVisible = isLoading);
  }

  ngAfterContentInit(): void {
    this.presets = {
      defaultPreset: this.defaultPreset,
    };

    if (typeof this.chosenTemplate === 'string' && this.presets.hasOwnProperty(this.chosenTemplate)) {
      this.chosenTemplate = this.presets[this.chosenTemplate];
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
