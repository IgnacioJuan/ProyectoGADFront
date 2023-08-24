import { Archivo } from './../../../models/Archivo';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ArchivoService } from 'src/app/services/archivo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { ActividadService } from 'src/app/services/actividad.service';
import { Evidencia } from 'src/app/models/Evidencia';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { Indicador } from 'src/app/models/Indicador';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actividades } from 'src/app/models/actividades';
import { LoginService } from 'src/app/services/login.service';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';

@Component({
  selector: 'app-evidencias',
  templateUrl: './evidencias.component.html',
  styleUrls: ['./evidencias.component.css'],
})
export class EvidenciasResponComponent implements OnInit {
  mensaje = '';
  progressInfo = [];
  filename = '';
  fileInfos: Observable<any> | undefined;
  selectedFiles: FileList | undefined;
  evidencias: any[] = [];
  Archivos: any[] = [];
  Actividades: any[] = [];
  aRCHI!: Archivo[];
  //archivo
  //descripcion: string = "";
  noti=new Notificacion();
  idusuario:any=null;
  nombre:any=null;

  filearchivo!: File;
  progreso: number = 0;
  public archivos = new Archivo();
  formulario: FormGroup;
  user: any = null;
  isLoggedIn = false;
  searchText = '';

  constructor(private archivo: ArchivoService,
    private _snackBar: MatSnackBar,
    private services: ActividadService,
    public login: LoginService,
    private notificationService:NotificacionService,
    private evidenciaservice: EvidenciaService,
    private fb: FormBuilder,
    private router: Router
  ) {

    this.formulario = this.fb.group({
      descripcion: ['', Validators.required],
    });


  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.filearchivo = event.target.files[0];
    }
  }
  @ViewChild('fileInput') fileInput!: ElementRef;
  activ: Actividades = new Actividades();
  archi: Archivo = new Archivo()
  ngOnInit(): void {
    const data = history.state.data;
    this.activ = data;
    if (this.activ == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }

    const datos = history.state.data;
    this.archi = data;
    if (this.archi == undefined) {
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
    this.listar();
  }
  descripcion: string = "";

  mostra() {
    this.fileInfos = this.archivo.listar();
  }

  listar(): void {
    this.archivo.geteviasig(this.user.username).subscribe(data => {
      this.aRCHI = data.filter(archivo => archivo.actividad?.id_actividad === this.activ.id_actividad);
    });
  }

  notificar() {
    this.noti.fecha = new Date();
    this.noti.rol = "SUPERADMIN";
    this.noti.mensaje = this.user.persona.primer_nombre+" "+this.user.persona.primer_apellido+" ha subido una evidencia "
    +"para la actividad "+ this.activ.nombre;

    this.noti.visto = false;
    this.noti.usuario =  0;

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
    this.noti.mensaje = this.user.persona.primer_nombre+" "+this.user.persona.primer_apellido+" ha subido una evidencia "
    +"para la actividad "+ this.activ.nombre;
    this.noti.visto = false;
    this.noti.usuario =  0;

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
  //eliminado de la carpeta
  eliminar(filename: string) {
    this.archivo.borrar(filename).subscribe(res => {
      this.fileInfos = this.archivo.listar();
    })
  }
  elim(nom:string, id:any) {
    Swal.fire({
      title: "Confirmación",
      text: "¿Estás seguro de que quieres eliminar " + nom + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminar(nom);
        console.log(id);
        this.eliminarlog(id);
        Swal.fire("Eliminado", nom + " ha sido eliminado correctamente.", "success");
      }
    });
  }


  onUpload(): void {
    this.archivo.cargar(this.filearchivo, this.descripcion, this.activ.id_actividad).subscribe(
      event => {
        console.log('Archivo subido:');
        // Lógica adicional después de subir el archivo
        Swal.fire({
          title: '¡Éxito!',
          text: 'El archivo se ha subido correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.descripcion = '';
        this.listar();
      },
      error => {
        console.error('Error al subir el archivo:', error);
        // Lógica adicional para manejar el error
        Swal.fire({
          title: '¡Error!',
          text: 'Nombre del archivo repetido',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
    this.notificar();
    this.notificaradmin();
  }

  eliminarlog(act:any) {
    this.archivo.eliminar(act).subscribe(
      (response) => {
        this.listar();
      },
      (error) => {
        console.error('Error al eliminar:', error);
      }
    );
  }

  // código para subir el archivo

}
