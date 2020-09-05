import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';

import {SharedModule} from '../shared/shared.module';

import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,

    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,

    SharedModule,
  ]
})
export class AuthModule {
}
