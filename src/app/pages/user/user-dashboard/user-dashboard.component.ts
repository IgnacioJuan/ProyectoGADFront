import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { SubmenuserviceService } from 'src/app/services/submenuservice.service';
import { Router } from '@angular/router';
import { iconos } from '../iconos.json';

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
  submenuData!: any[];
  icon=iconos as any[];

  constructor(public login:LoginService , private loadingService: LoadingServiceService,
    private submenuserv:SubmenuserviceService,private  router: Router
) { }
  ngOnInit() {
    this.loadingService.show();
    this.submenuData = this.submenuserv.getSubmenu();
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    setInterval(() => this.updateClock(), 1000);
    this.rol = this.login.getUserRole();
    this.loadingService.hide();

    
  }
  obtenerIcono(titulo: string): string{
    const icono = this.icon.find((item) => item.nombre === titulo.toLowerCase());
    return icono ? icono.imagen : 'assets/iconos/poas.png';
  }
  irdir(sub:any){
    this.router.navigate(['/'+sub]);
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
    this.day = `${now.toLocaleDateString('es-EC', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })}`;
  }
}