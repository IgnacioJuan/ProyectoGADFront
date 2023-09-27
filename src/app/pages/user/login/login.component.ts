import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private suscripciones: Subscription[] = [];

  loginData = {
    "username": '',
    "password": '',
  }

  constructor(private _snack: MatSnackBar, private loginService: LoginService, private router: Router,
    private loadingService: LoadingServiceService
  ) { }

  ngOnInit(): void {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
  }
  ngOnDestroy() {
    // Desuscribe todas las suscripciones en ngOnDestroy
    this.suscripciones.forEach(suscripcion => suscripcion.unsubscribe());
  }


  formSubmit() {
    this.loadingService.show();
    if (this.loginData.username.trim() == '' || this.loginData.username.trim() == null) {
      // this._snack.open('El username de usuario es requerido !!', 'Aceptar')
      Swal.fire(
        'Error',
        'El username de usuario es requerido !!',
        'warning'
      )
      this.loadingService.hide();

      return;
    }

    else if (this.loginData.password.trim() == '' || this.loginData.password.trim() == null) {
      // this._snack.open('La password es requerida !!', 'Aceptar')
      Swal.fire(
        'Error',
        'La password es requerida !!',
        'warning'
      )
      this.loadingService.hide();

      return;
    } else (
      this.suscripciones.push(

        this.loginService.generateToken(this.loginData).subscribe(
          (data: any) => {
            this.loginService.loginUser(data.token);
            this.suscripciones.push(

              this.loginService.getCurrentUser().subscribe((user: any) => {
                this.loginService.setUser(user);
                this.loadingService.hide();

                if (this.loginService.getUserRole() == 'ADMIN') {
                  //dashboard admin
                  //window.location.href = '/adm/admin';
                  this.router.navigate(['user-dashboard']);
                  location.replace('/use/user-dashboard');
                  this.loginService.loginStatusSubjec.next(true);
                }
                else if (this.loginService.getUserRole() == 'RESPONSABLE') {
                  //user dashboard
                  //window.location.href = '/use/user-dashboard';
                  this.router.navigate(['user-dashboard']);
                  location.replace('/use/user-dashboard');
                  this.loginService.loginStatusSubjec.next(true);
                }
                else if (this.loginService.getUserRole() == 'SUPERADMIN') {
                  //user dashboard
                  //window.location.href = '/use/user-dashboard';
                  this.router.navigate(['dashboard']);
                  location.replace('/use/user-dashboard');
                  this.loginService.loginStatusSubjec.next(true);
                }
                else if (this.loginService.getUserRole() == 'AUTORIDAD') {
                  //user dashboard
                  //window.location.href = '/use/user-dashboard';
                  this.router.navigate(['user-dashboard']);
                  location.replace('/use/user-dashboard');
                  this.loginService.loginStatusSubjec.next(true);
                  window.location.reload();
                }
                else {
                  this.loginService.logout();
                }
              }, (error) => {
                this.loadingService.hide();
    
                Swal.fire(
                  'Error',
                  'Detalles inválidos , vuelva a intentar !!',
                  'warning'
                )
                // this.open_snackBar('Detalles inválidos , vuelva a intentar !!', 'Aceptar')
              }
              
              ))
          }, (error) => {
            this.loadingService.hide();

            Swal.fire(
              'Error',
              'Detalles inválidos , vuelva a intentar !!',
              'warning'
            )
            // this.open_snackBar('Detalles inválidos , vuelva a intentar !!', 'Aceptar')
          }
        ))
    )
  }
}
