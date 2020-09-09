import {
  ComponentFactoryResolver, ComponentRef,
  Directive,
  ElementRef,
  Input, OnDestroy,
  OnInit, Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {LoaderComponent} from './loader.component';
import {LoaderService} from './loader.service';

export type Presets = 'defaultPreset';

@Directive({selector: '[appLoader]'})
export class LoaderDirective implements OnInit, OnDestroy {
  parentZIndex = 0;
  activeTemplate: Presets | TemplateRef<any> = 'defaultPreset';

  @Input() set appLoader(template: Presets | TemplateRef<any>) {
    if ((typeof template === 'string' && this.loader.loaderPresets.indexOf(template) > -1) || template instanceof TemplateRef) {
      this.activeTemplate = template;
    } else {
      console.error('Loader must be either string or template reference');
    }
  }

  componentRef: ComponentRef<LoaderComponent>;
  componentFactory = this.resolver.resolveComponentFactory(LoaderComponent);

  destroy$: Subject<boolean> = new Subject();

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private loader: LoaderService,
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {
    this.parentZIndex = this.element.nativeElement.parentElement.style.zIndex;
  }

  ngOnInit(): void {
    const parent = this.element.nativeElement.parentElement;
    if (['relative', 'absolute', 'fixed'].indexOf(parent.style.position) === -1) {
      this.renderer.setStyle(parent, 'position', 'relative');
    }
    this.componentRef = this.viewContainerRef.createComponent(this.componentFactory);
    this.componentRef.instance.chosenTemplate = this.activeTemplate;

    this.loader.loading$.pipe(takeUntil(this.destroy$)).subscribe(isLoading => {
      if (isLoading) {
        this.element.nativeElement.parentElement.style.zIndex = -1;
        this.element.nativeElement.parentElement.style.userSelect = 'none';
        this.componentRef.instance.zIndex = this.element.nativeElement.parentElement.style.zIndex + 1;
      } else {
        this.componentRef.instance.zIndex = -1;
        this.element.nativeElement.parentElement.style.userSelect = 'auto';
        this.element.nativeElement.parentElement.style.zIndex = this.parentZIndex;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
