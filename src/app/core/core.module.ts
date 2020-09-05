import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared/shared.module';

import {HomeComponent} from './home/home.component';
import {HeaderComponent} from './header/header.component';
import {NotFoundComponent} from '../shared/not-found/not-found.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,

    SharedModule,
  ]
})
export class CoreModule {
}
