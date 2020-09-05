import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {LoaderDirective} from './loader/loader.directive';
import {LoaderComponent} from './loader/loader.component';
import {PlaceholderComponent} from './placeholder/placeholder.component';
import {LoaderService} from './loader/loader.service';
import {RequestsService} from './requests.service';

@NgModule({
  declarations: [
    LoaderDirective,

    LoaderComponent,
    PlaceholderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,

    MatProgressSpinnerModule
  ],
  exports: [
    RouterModule,
    HttpClientModule,

    LoaderDirective,

    LoaderComponent,
    PlaceholderComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule,
      providers: [
        LoaderService,
        RequestsService
      ]
    };
  }
}
