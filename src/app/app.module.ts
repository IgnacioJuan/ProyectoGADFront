import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { authInterceptorProviders } from './services/auth/auth.interceptor';
import { SiderbarComponent } from './components/siderbar/siderbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from "@angular/forms";
import { CustomDatePipe } from './pages/superadmin/reporteavancepoa/reporteavancepoa.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SiderbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    //Poner en shared
    BrowserAnimationsModule,
    FormsModule,
    //
    SharedModule
  ],

  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) { }
}
