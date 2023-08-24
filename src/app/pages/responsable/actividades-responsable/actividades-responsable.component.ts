import { Evidencia } from 'src/app/models/Evidencia';
import { Archivo } from './../../../models/Archivo';
import { Actividades } from './../../../models/actividades';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActividadService } from 'src/app/services/actividad.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { Modelo } from 'src/app/models/Modelo';

@Component({
  selector: 'app-actividades-responsable',
  templateUrl: './actividades-responsable.component.html',
  styleUrls: ['./actividades-responsable.component.css']
})
export class ActividadesResponsableComponent implements OnInit {
  searchText = '';
  @ViewChild('datosModalRef') datosModalRef: any;
  miModal!: ElementRef;
  public actividad = new Actividades();
  Actividades: any[] = [];
  guardadoExitoso: boolean = false;
  frmActividades: FormGroup;
  noti = new Notificacion();
  user: any = null;
  idusuario: any = null;
  nombre: any = null;
  nombreact: any = null;
  isLoggedIn = false;

  constructor(
    private services: ActividadService,
    private fb: FormBuilder,
    private router: Router,
    public login: LoginService,
    private modeloService: ModeloService,
    private notificationService: NotificacionService
  ) {
    this.fechaminima();
    this.frmActividades = fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required]

    });
  }
  evi: Evidencia = new Evidencia();
  ngOnInit(): void {

    const data = history.state.data;
    this.evi = data;
    if (this.evi == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }

    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();

      }
    )
    this.fechaminima();
    this.calcularfecha();
    this.listar();
  }

  notificar() {
    this.noti.fecha = new Date();
    this.noti.rol = "SUPERADMIN";
    this.noti.mensaje = this.user.persona.primer_nombre + " " + this.user.persona.primer_apellido + " ha creado la actividad " + this.frmActividades.value.nombre;
    this.noti.visto = false;
    this.noti.usuario = 0;

    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  notificaradmin() {
    this.noti.fecha = new Date();
    this.noti.rol = "ADMIN";
    this.noti.mensaje = this.user.persona.primer_nombre + " " + this.user.persona.primer_apellido + " ha creado la actividad " + this.frmActividades.value.nombre;
    this.noti.visto = false;
    this.noti.usuario = 0;

    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }
  validarFechas(): void {
    const fechaInicio = this.frmActividades.get('fecha_inicio')?.value as string;
    const fechaFin = this.frmActividades.get('fecha_fin')?.value as string;

    if (fechaInicio && fechaFin) {
      const dateInicio = new Date(fechaInicio);
      const dateFin = new Date(fechaFin);

      if (dateFin < dateInicio) {
        this.frmActividades.setErrors({ fechasInvalidas: true });
      } else {
        this.frmActividades.setErrors(null);
      }
    }
  }


  guardar() {
    this.actividad = this.frmActividades.value;
    this.actividad.evidencia = this.evi;
    this.actividad.usuario = this.user.id;
    this.actividad.estado = "pendiente"
    this.services.crear(this.actividad)
      .subscribe(
        (response) => {
          console.log('creado con éxito:', response);
          this.guardadoExitoso = true;
          this.notificar();
          this.notificaradmin();
          this.listar();
          Swal.fire({
            title: 'Guardado con éxito',
            text: 'La actividad ha sido guardada satisfactoriamente',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        },
        (error) => {
          console.error('Error al crear:', error);
          Swal.fire({
            title: 'Error al guardar',
            text: 'Ocurrió un error al guardar la actividad',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      );
  }
  editDatos(acti: Actividades) {
    this.actividad = acti;
    this.frmActividades = new FormGroup({
      nombre: new FormControl(acti.nombre),
      descripcion: new FormControl(acti.descripcion),
      fecha_inicio: new FormControl(acti.fecha_inicio),
      fecha_fin: new FormControl(acti.fecha_fin)
    });
  }

  listar(): void {
    const fechaActual = new Date();
    this.services.geteviasig(this.user.username).subscribe(data => {
      this.Actividades = data.filter(actividad => actividad.evidencia?.id_evidencia === this.evi.id_evidencia);
    });
  }


  eliminar(act: any) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.services.eliminar(act).subscribe(
          (response) => {
            this.listar();
            Swal.fire({
              title: 'Eliminado',
              text: 'El registro ha sido eliminado correctamente',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
          },
          (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire({
              title: 'Error al eliminar',
              text: 'Ocurrió un error al eliminar el registro',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        );
      }
    });
  }

  limpiarFormulario() {
    this.frmActividades.reset();
    this.actividad = new Actividades;
  }

  actualizar() {
    this.actividad.nombre = this.frmActividades.value.nombre;
    this.actividad.descripcion = this.frmActividades.value.descripcion;
    this.actividad.fecha_inicio = this.frmActividades.value.fecha_inicio;
    this.actividad.fecha_fin = this.frmActividades.value.fecha_fin;
    this.actividad.usuario = null;
    console.log(this.actividad)
    this.services.update(this.actividad.id_actividad, this.actividad)
      .subscribe(response => {
        this.actividad = new Actividades();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      });
  }
  archivo: Archivo = new Archivo();

  verDetalles(archivos: any) {
    this.router.navigate(['/res/evidenciaResponsable'], { state: { data: archivos } });
  }
  calcularfecha() {
    this.services.geteviasig(this.user.username).subscribe(data => {
      this.Actividades = data;

      // Obtener la fecha actual
      const fechaActual = new Date();

      // Iterar sobre las actividades y verificar la fecha
      this.Actividades.forEach(actividad => {
        const fechaFinActividad = new Date(actividad.fecha_fin);

        // Verificar si la fecha de finalización de la actividad es mayor o igual a la fecha actual
        if (fechaFinActividad >= fechaActual) {
          // Calcular la diferencia en días entre la fecha actual y la fecha de finalización de la actividad
          const tiempoRestante = fechaFinActividad.getTime() - fechaActual.getTime();
          const diasRestantes = Math.ceil(tiempoRestante / (1000 * 3600 * 24));

          // Verificar si quedan 3 días o menos para la fecha de finalización de la actividad
          if (diasRestantes <= 3) {
            // Mostrar la notificación individual con SweetAlert
            Swal.fire({
              title: `Actividad "${actividad.nombre}"`,
              text: `Faltan ${diasRestantes} días para que se cumpla la fecha de finalización.`,
              icon: 'warning',
              position: 'top-end',
              toast: true,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              customClass: {
                title: 'custom-title',
                popup: 'custom-popup',
                icon: 'custom-icon',
                confirmButton: 'custom-button'
              }
            });
          }
        }
      });
    });
  }


  fechaMinima: string = "";
  fechaMax: string = "";

  datasource: Modelo[] = [];
  fechaminima() {
    this.modeloService.getModeMaximo().subscribe(data => {

      const fechaInicio = new Date(data.fecha_inicio);
      this.fechaMinima = fechaInicio.toISOString().split('T')[0];

      const fechaactividad = new Date(data.fecha_final_act);
      this.fechaMax = fechaactividad.toISOString().split('T')[0];


    });
  }
}
