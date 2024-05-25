import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CountdownModule } from 'ngx-countdown';
import { HttpClientModule } from '@angular/common/http';
import { CountdownWrapperComponent } from './components/countdown-wrapper/countdown-wrapper.component';
import {DonationControlsComponent} from "./components/donation-controls/donation-controls.component";
import {LoginLogoutComponent} from "./components/login-logout/login-logout.component";

@NgModule({
  declarations: [
    AppComponent,
    CountdownWrapperComponent,
    DonationControlsComponent,
    LoginLogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CountdownModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
