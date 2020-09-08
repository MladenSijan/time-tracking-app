import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AuthModule} from './auth/auth.module';
import {CoreModule} from './core/core.module';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {dbConfig} from './config/db-config';
import {NgxIndexedDBModule} from 'ngx-indexed-db';
import {SharedModule} from './shared/shared.module';
import {AccountService, AlertService, DatabaseService} from './services';
import {appInitializer, ErrorInterceptor, fakeBackendProvider, JwtInterceptor} from './helpers';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    NgxIndexedDBModule.forRoot(dbConfig),

    SharedModule.forRoot(),
    AuthModule,
    CoreModule,
    AppRoutingModule,
  ],
  providers: [
    AlertService,
    AccountService,
    DatabaseService,

    {provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService]},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
