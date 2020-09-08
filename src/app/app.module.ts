import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AuthModule} from './auth/auth.module';
import {CoreModule} from './core/core.module';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';

import {AccountService} from './services';
import {dbConfig} from './config/db-config';
import {NgxIndexedDBModule} from 'ngx-indexed-db';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {fakeBackendProvider} from './services/fake-backend.service';
import {appInitializer, ErrorInterceptor, JwtInterceptor} from './helpers';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    NgxIndexedDBModule.forRoot(dbConfig),

    AuthModule,
    CoreModule,
    AppRoutingModule,
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService]},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
