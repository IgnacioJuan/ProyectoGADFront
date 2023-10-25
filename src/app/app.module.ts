import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SiderbarComponent } from './components/siderbar/siderbar.component';
import { authInterceptorProviders } from './services/auth/auth.interceptor';
import { SharedModule } from './shared/shared.module';
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';
import { SubmenuserviceService } from './services/submenuservice.service';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SiderbarComponent,
    FooterComponent,
    SobreNosotrosComponent,

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
  providers: [authInterceptorProviders,SubmenuserviceService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) { }
}
