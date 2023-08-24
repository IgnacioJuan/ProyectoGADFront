import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  time: string="";
  day: string="";
  isLoggedIn = false;
  user: any = null;
  rol: any = null;
  constructor(public login:LoginService) { }
  ngOnInit() {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    )
    setInterval(() => this.updateClock(), 1000);
    this.rol = this.login.getUserRole();
  }

  updateClock() {
    // Crea un objeto de fecha
    const now = new Date();

    // Obtiene la hora y los minutos
    let hours = now.getHours();
    const minutes = now.getMinutes();

    // Ajusta la hora para mostrar AM o PM
    let ante = 'AM';
    if (hours >= 12) {
      ante = 'PM';
      hours -= 12;
    }
    if (hours === 0) {
      hours = 12;
    }

    // Formatea la hora y la fecha
    this.time = `${hours}:${minutes.toString().padStart(2, '0')} ${ante}`;
    this.day = `${now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })}`;
  }
}