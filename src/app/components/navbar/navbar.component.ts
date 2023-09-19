import { NotificacionService } from 'src/app/services/notificacion.service';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Notificacion } from 'src/app/models/Notificacion';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DatePipe]
})
export class NavbarComponent implements OnInit {
  numNotificacionesSinLeer: number = 0;
  showNotificationsModal = false;
  isLoggedIn = false;
  rol: any = null;
  user: any = null;
  noti = new Notificacion();
  notificaciones: Notificacion[] = [];
  notificaciones2: Notificacion[] = [];
  idactividad:any;

  constructor(public login: LoginService, private notificationService: NotificacionService, private dialog: MatDialog, private rout: Router) {
    this.rol = this.login.getUserRole();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    );
    this.listarnoti(this.user.id);
  }

  listarnoti(id: any) {
    console.log("id ver " + id);
    // Cargar notificaciones propias por id
    this.notificationService.getNotificaciones(id).subscribe(
      (dataPropias: Notificacion[]) => {
        this.notificaciones = dataPropias;
        this.numNotificacionesSinLeer = this.notificaciones.filter(n => !n.visto).length;
        // Verifica si es ADMIN o SUPERADMIN
        if (this.rol == "ADMIN" || this.rol == "SUPERADMIN") {
          // Cargar notificaciones del rol ADMIN
          this.notificationService.allnotificacion(this.rol).subscribe(
            (dataRol: Notificacion[]) => {
              this.notificaciones = this.notificaciones.concat(dataRol);
              this.numNotificacionesSinLeer += dataRol.filter(n => !n.visto).length;
              // Ordenar las notificaciones por fecha (de más reciente a más antigua)
              this.notificaciones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            },
            (errorRol: any) => {
              console.error('No se pudieron listar las notificaciones por rol');
            }
          );
        }
      },
      (errorPropias: any) => {
        console.error('No se pudieron listar las notificaciones propias');
      }
    );
  }

  /*listarnot(id: any) {
    if (this.rol == "ADMIN" || this.rol == "SUPERADMIN") {
      // Cargar notificaciones del rol ADMIN
      this.notificationService.allnotificacion(this.rol).subscribe(
        (data: Notificacion[]) => {
          this.notificaciones = data;
          this.numNotificacionesSinLeer = this.notificaciones.filter(n => !n.visto).length;
          // Cargar notificaciones propias por id
          this.notificationService.getNotificaciones(id).subscribe(
            (dataPropias: Notificacion[]) => {
              this.notificaciones = this.notificaciones.concat(dataPropias);
              this.numNotificacionesSinLeer += dataPropias.filter(n => !n.visto).length;
            },
            (errorPropias: any) => {
              console.error('No se pudieron listar las notificaciones propias');
            }
          );
        },
        (error: any) => {
          console.error('No se pudieron listar las notificaciones');
        }
      );
    } else {
      this.notificationService.getNotificaciones(id).subscribe(
        (data: Notificacion[]) => {
          this.notificaciones = data;
          this.numNotificacionesSinLeer = this.notificaciones.filter(n => !n.visto).length;
        },
        (error: any) => {
          console.error('No se pudieron listar las notificaciones');
        }
      );
    }
  }*/

  ir(noti:any){
    noti.url;
    if(noti.idactividad!=0){
      console.log("id ev"+noti.idactividad);
      localStorage.setItem("eviden",noti.idactividad)
      this.rout.navigate([noti.url]);
    }  else {
      this.rout.navigate([noti.url]);
    }
  }

  public logout() {
    this.login.logout();
    location.replace('/use/login');
  }

  perfil() {
    location.replace('/adm/admin');
  }


  openNotifications() {
    // Actualizo las notificaciones cargadas
    this.notificaciones.forEach((n) => {
      if (!n.visto) {
        n.visto = true;
        // Actualizar el estado de la notificación en el servidor
        this.notificationService.actualizar(n.id).subscribe(() => {
          console.log(`Notificación ${n.id} actualizada`);
        });
      }
    });

    // Actualizar el contador de notificaciones sin leer
    this.numNotificacionesSinLeer = 0;
  }

  closeNotifications() {
    this.showNotificationsModal = false;
  }

  toggleNotifications() {
    this.showNotificationsModal = !this.showNotificationsModal;
  }

  verPerfil() {
    location.replace('/use/userprofile')
    //this.rout.navigate(['/use/userprofile']);
  }

  redirectToDashboard() {
    location.replace('use/user-dashboard');
    //this.rout.navigate(['use/user-dashboard']);
  }

}
