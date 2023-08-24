import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { Evidencia } from 'src/app/models/Evidencia';
import Swal from 'sweetalert2';
import { ModeloService } from 'src/app/services/modelo.service';
import { Modelo } from 'src/app/models/Modelo';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';

@Component({
  selector: 'app-evidencia-tareas-asginadas',
  templateUrl: './evidencia-tareas-asginadas.component.html',
  styleUrls: ['./evidencia-tareas-asginadas.component.css']
})
export class EvidenciaTareasAsginadasComponent {
  // Propiedades y métodos anteriores
  evidencias: Evidencia[] = []; // Declaración de la propiedad
  isLoggedIn: boolean;
  user: any;
  dataSource: any;
  botonDeshabilitado: boolean | undefined;

  constructor(
    private asignaService: AsignaEvidenciaService,
    private login: LoginService,
    private evidenciaService: EvidenciaService,
    private modeloService: ModeloService,
    private router: Router
  ) {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
  }

  verDetalles(evidencia: any) {
    this.router.navigate(['/res/ActividadesResponsable'], { state: { data: evidencia } });
  }

  ngOnInit(): void {
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    );

    console.log(this.user.username);
    this.evidenciaService.geteviasig(this.user.username).subscribe(data => {
      this.evidencias = data;
      this.dataSource.data = this.evidencias; // Actualizar el dataSource
    });

    this.verificarFechaLimite();
  }

  // Resto del código

  verificarFechaLimite() {
    // Lógica para verificar la fecha límite usando el servicio ModeloService
    this.modeloService.getModeMaximo().subscribe(data => {
      const fechaActual = new Date();
      const fechaFin = new Date(data.fecha_final_act);

      if (fechaActual > fechaFin) {
        this.botonDeshabilitado = true;
        this.mostrarMensaje('Usted ya no puede crear actividades debido a una fecha límite superada.');
        return;
      }
    });
  }

  // Resto del código

  mostrarMensaje(mensaje: string) {
    Swal.fire({
      title: 'Advertencia',
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }
}
