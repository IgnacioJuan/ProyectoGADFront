import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { SidebarService } from 'src/app/components/sidebar.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {
  menuItems?: any[];
  isLoggedIn = false;
  user: any = null;
  rol: any = null;
  ruta: any = null;
  panelOpenState = false;
  time: string="";
  day: string="";
  constructor(private sidebarService: SidebarService, private router: Router, public login: LoginService, private loadingService: LoadingServiceService) {
    //this.cargar();
  }


  ngOnInit(): void {
    this.cargar();

    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    )
    this.rol = this.login.getUserRole();





    this.loadingService.show();

    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    setInterval(() => this.updateClock(), 1000);
    this.rol = this.login.getUserRole();
    this.loadingService.hide();
  }

  public logout() {
    this.login.logout();
    location.replace('/use/login');
  }
  verPerfil() {
    location.replace('/use/userprofile')
    //this.rout.navigate(['/use/userprofile']);
  }
  public irConocenos() {
    location.replace('/sobre-nosotros');
  }
  cargar() {
    if (this.isLoggedIn == false) {

      this.isLoggedIn = this.login.isLoggedIn();

      if (this.isLoggedIn) {

        //this.user = this.login.getUser();
        this.rol = this.login.getUserRole();

        if (this.rol == 'ADMIN') {
          this.menuItems = this.sidebarService.menu;
          this.ruta = 'admin';
        }
        else if (this.rol == 'SUPERADMIN') {
          this.menuItems = this.sidebarService.menu2
          this.ruta = 'usuarios';
        }
        else if (this.rol == 'RESPONSABLE') {
          this.menuItems = this.sidebarService.menu3
          this.ruta = 'actividad';
        }
        else if (this.rol == 'AUTORIDAD') {
          this.menuItems = this.sidebarService.menu4
          this.ruta = 'consulta';
        }
        else {
          console.log('rol: ' + this.rol);
        }
      } else {

      }

    }
    console.log('login: ' + this.isLoggedIn);
    console.log('aqui rol: ' + this.rol);
    console.log(this.user);
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
