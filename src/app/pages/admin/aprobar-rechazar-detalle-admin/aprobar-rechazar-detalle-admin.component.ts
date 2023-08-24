import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Evidencia } from 'src/app/models/Evidencia';
import { ActividadService } from 'src/app/services/actividad.service';
import { DetalleEvaluacionService } from 'src/app/services/detalle-evaluacion.service';
import { EmailServiceService } from 'src/app/services/email-service.service';
import Swal from 'sweetalert2';
import { ArchivoService } from 'src/app/services/archivo.service';
import { Archivo } from 'src/app/models/Archivo';
import { LoginService } from 'src/app/services/login.service';
import { MatPaginator } from '@angular/material/paginator';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { Observacion2 } from 'src/app/models/Observaciones2';
import { CriteriosService } from 'src/app/services/criterios.service';
import { Actividades } from 'src/app/models/actividades';
import { Usuario2 } from 'src/app/models/Usuario2';

@Component({
  selector: 'app-aprobar-rechazar-detalle-admin',
  templateUrl: './aprobar-rechazar-detalle-admin.component.html',
  styleUrls: ['./aprobar-rechazar-detalle-admin.component.css'],
})
export class AprobarRechazarDetalleAdminComponent implements OnInit {
  columnas: string[] = [
    'idactividad',
    'nombre',
    'descripcion',
    'fechainicio',
    'fechafin',
    'actions',
  ];
  columnasArchi: string[] = [
    'idArchivo',
    'nombreArchi',
    'descripcionArchi',
    'enlace',
  ];

  columnasObservaciones: string[] = [
    'id',
    'observacion',
    'actividad',
    'estado',
    'usuario',
    'acciones',
  ];



  archivoSeleccionado: string = '';
  noRegistros: any;
  noRegistrosAprobadas: any;
  panelOpenState = false;
  isSending = false;
  spinnerValue = 0;
  spinnerInterval: any;
  maxTime: number = 30; 
  mostrarbotonDetalle = false;
  evidencia: Evidencia = new Evidencia();
  dataSource = new MatTableDataSource<Actividades>();
  dataSource2 = new MatTableDataSource<Archivo>();
  dataSource3 = new MatTableDataSource<Observacion2>();

  usuarioCorreo: Usuario2 = new Usuario2();
  issloading = true;
  isexist?: boolean;
  isLinear = true;
  fileInfos: Observable<any> | undefined;
  selectedFiles: FileList | undefined;
  toUser: string = '';
  subject: string = '';
  message: string = '';
  mostrar = false;
  fechaActual: Date = new Date();
  fechaFormateada: string = this.fechaActual.toLocaleDateString('es-ES');
  estadoEvi = '';
  listadoActividad: Actividades[] = [];
  archivoSe: Archivo[] = [];
  nombreActividad = '';
  isLoggedIn = false;
  user: any = null;
  noti = new Notificacion();
  idusuario: any = null;
  nombre: any = null;
  correoEnviar = '';
  disableEvaluar: boolean = false;
  observaciones: Observacion2 = new Observacion2();
  observacion = '';
  actividadSeleccionada: Actividades = new Actividades();
  public actividad = new Actividades();
  listadoObservaciones: Observacion2[] = [];

  constructor(
    private services: ActividadService,
    private router: Router,
    private detalleEvaluaService: DetalleEvaluacionService,
    private emailService: EmailServiceService,
    private archivo: ArchivoService,
    public login: LoginService,
    private notificationService: NotificacionService,
    private serviceObser: CriteriosService
  ) {}

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }
  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });

    const data = history.state.data;
    const usuarioResponsable = history.state.usuarioEnviar;
    this.evidencia = data;
    this.usuarioCorreo = usuarioResponsable;
    this.correoEnviar = this.usuarioCorreo.persona.correo;
    this.toUser = this.correoEnviar;

    if (this.evidencia == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }

    if (this.usuarioCorreo == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }

    this.listar();
  }

  //
  seleccionarArchivo(element: any) {
    this.archivoSeleccionado = element.nombre;
    this.actividadSeleccionada = element;
    console.log(this.actividadSeleccionada);
  }

  //
  notificarrechazo() {
    this.noti.fecha = new Date();
    this.noti.rol = 'SUPERADMIN';
    const nombres = localStorage.getItem('nombres');
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' ha rechazado la evidencia ' +
      this.archivoSeleccionado +
      ' de ' +
      nombres;
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

  notificarrechazouser() {
    this.noti.fecha = new Date();
    this.noti.rol = '';
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' ha rechazado tu evidencia ' +
      this.archivoSeleccionado;
    this.noti.visto = false;
    const idUsuarioString = localStorage.getItem('idUsuario');
    const idUsuario = Number(idUsuarioString);
    this.noti.usuario = idUsuario;
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

  notificarrechazoadmin() {
    this.noti.fecha = new Date();
    this.noti.rol = 'ADMIN';
    const nombres = localStorage.getItem('nombres');
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' ha rechazado la evidencia ' +
      this.archivoSeleccionado +
      ' de ' +
      nombres;
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
  //
  notificaraprobacion() {
    this.noti.fecha = new Date();
    this.noti.rol = 'SUPERADMIN';
    const nombres = localStorage.getItem('nombres');
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' ha aprobado la evidencia ' +
      this.archivoSeleccionado +
      ' de ' +
      nombres;
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

  notificaraprobacionuser() {
    this.noti.fecha = new Date();
    this.noti.rol = '';
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' aprobo tu evidencia ' +
      this.archivoSeleccionado;
    this.noti.visto = false;
    const idUsuarioString = localStorage.getItem('idUsuario');
    const idUsuario = Number(idUsuarioString);
    this.noti.usuario = idUsuario;

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

  notificaraprobacionadmin() {
    this.noti.fecha = new Date();
    this.noti.rol = 'ADMIN';
    const nombres = localStorage.getItem('nombres');
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' ha aprobado la evidencia ' +
      this.archivoSeleccionado +
      ' de ' +
      nombres;
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
  //
  notificar() {
    this.noti.fecha = new Date();
    this.noti.rol = 'SUPERADMIN';
    const nombres = localStorage.getItem('nombres');
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' ha aprobado la evidencia ' +
      this.archivoSeleccionado +
      ' de ' +
      nombres;
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

  notificaruser() {
    this.noti.fecha = new Date();
    this.noti.rol = '';
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' agrego una observación a tu evidencia ' +
      this.archivoSeleccionado;
    this.noti.visto = false;
    const idUsuarioString = localStorage.getItem('idUsuario');
    const idUsuario = Number(idUsuarioString);
    this.noti.usuario = idUsuario;

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
    this.noti.rol = 'ADMIN';
    const nombres = localStorage.getItem('nombres');
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' ha agregado una observacion para ' +
      this.archivoSeleccionado +
      ' de ' +
      nombres;
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

  listar(): void {
    this.services.getEviAsig(this.evidencia.id_evidencia).subscribe((data) => {
      this.listadoActividad = data;
      console.log(this.listadoActividad);
      this.dataSource.data = this.listadoActividad;

      const index = 0;
      if (index >= 0 && index < this.dataSource.data.length) {
        const idActividad = this.dataSource.data[index].id_actividad;
        console.log('idActividad:', idActividad);
       
      } else {
        console.log('Índice fuera de rango');
      }
    });
  }

  


  seleccionarTareaDetalle(element: any) {
    const idActividad = element.id_actividad
    this.noRegistros = null;
 
    this.services.getObservacionByActi(idActividad).subscribe((data) => {
      this.listadoObservaciones = data;
     
      
      if(data.length>0)
      {
        this.dataSource3.data=this.listadoObservaciones;
        this.disableEvaluar = true;

      }else{
        this.noRegistros = 'No hay registros disponibles.';

      }
    });

      this.listar();
}


  

  listarArchivo(element: any) {
    this.archivo.getarchivoActividad(element.id_actividad).subscribe((data) => {
      this.archivoSe = data;
      this.dataSource2.data = this.archivoSe;
    });
    this.nombreActividad = element.nombre;
  }

  goBack() {
    this.router.navigate(['/adm/apruebaAdmin']);
  }

  Aprobado() {
    Swal.fire({
      icon: 'success',
      title: 'La actividad ha sido aprobada',
      showConfirmButton: false,
      timer: 1500,
    });
    this.mostrar = false;
    this.estadoEvi = 'Aprobada';
    this.observacion = 'Ninguna';
    this.notificaraprobacion();
    this.notificaraprobacionadmin();
    this.notificaraprobacionuser();
    this.disableEvaluar = true;
    this.observaciones.observacion = this.observacion = 'Ninguna';
  }

  Rechazado() {
    Swal.fire({
      icon: 'error',
      title: 'La actividad ha sido rechazada.',
    });
    this.estadoEvi = 'Rechazada';

    this.mostrar = !this.mostrar;

    this.notificarrechazo();
    this.notificarrechazoadmin();
    this.notificarrechazouser();
    this.disableEvaluar = true;
  }

  obtenerNombreArchivo(url: string): string {
    const nombreArchivo = url.substring(url.lastIndexOf('/') + 1);
    return nombreArchivo;
  }




  Guardar() {
    if (
      this.observaciones.observacion == '' ||
      this.observaciones.observacion == null ||
      this.actividadSeleccionada.estado == '' ||
      this.actividadSeleccionada.estado == null
    ) {
      Swal.fire({
        title: 'Alerta',
        text: 'No se ha agregado ninguna observación por favor agregue alguna ',
        icon: 'warning',
      });
    } else {
      this.actividadSeleccionada.estado = this.estadoEvi;
      this.actividadSeleccionada.usuario = null;
      console.log(this.actividadSeleccionada);

      if (this.actividadSeleccionada) {
        this.services
          .update(
            this.actividadSeleccionada.id_actividad,
            this.actividadSeleccionada
          )
          .subscribe((response) => {
            this.listar();
          });
      } else {
        console.log('id_actividad es undefined');
      }

      this.observaciones.observacion = this.observacion;
      this.observaciones.actividad.id_actividad =
        this.actividadSeleccionada.id_actividad;
      this.observaciones.usuario = this.user.id;
      this.services
        .createObservacion(this.observaciones)
        .subscribe((data) =>
          Swal.fire(
            'Guardado con éxito!',
            'Observaciones guardado con éxito',
            'success'
          )
        );
    }
  }

  getColorByEstado(estado: string): string {
    if (estado === 'pendiente') {
      return 'rgba(255, 242, 170)';
    } else if (estado === 'Aprobada') {
      return 'rgba(96, 179, 114)';
    } else if (estado === 'Rechazada') {
      return 'rgba(253, 79, 56)';
    } else {
      return '';
    }
  }

  Eliminar(element: any) {
    const id = element.id_observacion;
    Swal.fire({
      title: 'Desea eliminarlo?',
      text: 'No podrá revertirlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.services.eliminarObser(id).subscribe((response) => {});
        this.listar();
        Swal.fire('Eliminado!', 'Registro eliminado.', 'success');
      }
    });
  }

  enviar() {
    const startTime = new Date();
    this.isSending = true;
    this.spinnerInterval = setInterval(() => {
      const endTime = new Date();
      const timeDiff = (endTime.getTime() - startTime.getTime()) / 1000;
      this.spinnerValue = Math.round((timeDiff / this.maxTime) * 100); // Calcular porcentaje del tiempo máximo y actualizar valor del spinner
      if (timeDiff >= this.maxTime) {
        // Si se alcanza el tiempo máximo, detener el spinner
        clearInterval(this.spinnerInterval);
      }
    }, 1000);
    this.emailService
      .sendEmail([this.toUser], this.subject, this.message)
      .subscribe(
        (response) => {
          clearInterval(this.spinnerInterval); // Detener el spinner al completar el envío
          this.isSending = false;
          const endTime = new Date(); // Obtener hora actual después de enviar el correo
          const timeDiff = (endTime.getTime() - startTime.getTime()) / 1000; // Calcular diferencia de tiempo en segundos
          console.log(
            'Email sent successfully! Time taken:',
            timeDiff,
            'seconds'
          );
          console.log('Email sent successfully!');
          Swal.fire({
            title: 'El correo se ha enviado con éxito',
            timer: 2000,
            timerProgressBar: true,
            width: '20%',
            customClass: 'custom-alert',
            position: 'top-end',
            iconHtml:
              '<span class="custom-icon"><i class="fas fa-check-circle" style="color: green;" ></i></span>',
            showConfirmButton: false,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        },
        (error) => {
          clearInterval(this.spinnerInterval); // Detener el spinner si ocurre un error
          this.isSending = false;
          Swal.fire({
            title: 'No se pudo enviar el correo electrónico',
            timer: 2000,
            width: '20%',
            customClass: 'custom-alert my-custom-swal',
            timerProgressBar: true,
            position: 'top-end',
            iconHtml:
              '<span class="custom-icon" ><i class="fas fa-times-circle" style="color: red;" ></i></span>',

            showConfirmButton: false,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          console.error('Error sending email:', error);
        }
      );
  }


  
  Limpiar() {
    this.message = '';
    this.subject = '';
    this.observaciones.observacion = '';
  }

  LimpiarModal() {
    this.mostrar = false;
    this.estadoEvi = '';
    this.subject = '';
    this.observaciones.observacion = '';
    this.message = '';
  }
}
