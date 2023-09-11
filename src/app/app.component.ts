import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoadingServiceService } from './components/loading-spinner/LoadingService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sistema ACI';
  isLoggedIn = false;
  showLoading = false;

  constructor(public login: LoginService,
    private loadingService: LoadingServiceService) {
  }
  ngOnInit(): void {


    this.isLoggedIn = this.login.isLoggedIn();
  }
  get isLoading$() {
    return this.loadingService.isLoading;
  }
}
