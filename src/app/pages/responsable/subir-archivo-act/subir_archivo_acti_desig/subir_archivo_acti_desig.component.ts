import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Archivo } from 'src/app/models/Archivo';
import { ArchivoService } from 'src/app/services/archivo.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { Actividad_arch } from 'src/app/services/actividad_arch';
import { MatPaginator } from '@angular/material/paginator';
import { PoaService } from 'src/app/services/poa.service';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { ActividadService } from 'src/app/services/actividad.service';
@Component({
  selector: 'app-subir_archivo_acti_desig',
  templateUrl: './subir_archivo_acti_desig.component.html',
  styleUrls: ['./subir_archivo_acti_desig.component.css'],
})
export class Subir_archivo_acti_desigComponent implements OnInit {
  displayedColumns: string[] = [
    'Id',
    'Archivo',
    'Descripcion',
    'Fecha',
    'Valor',
    'Estado',
    'Accion',
  ];
  fileInfos: Observable<any> | undefined;
  isLoggedIn = false;
  user: any = null;
  aRCHI!: Archivo[];

  filearchivo!: File;

  public archivon = new Archivo();
  // Crear una fuente de datos para la tabla
  dataSource = new MatTableDataSource<Archivo>();
  formulario: FormGroup;
  @ViewChild('archivoInput') archivoInput!: ElementRef<HTMLInputElement>; // Note the "!" operator
  variable1: number = 0; // Asigna un valor predeterminado o inicializa la variable
  variable2: number = 0; // Asigna un valor predeterminado o inicializa la variable
  valorMaximo: number = 0;
  constructor(
    private archivo: ArchivoService,
    public login: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private poaservis: PoaService,
    private actiservis: ActividadService, //importar el spinner como servicio
    private loadingService: LoadingServiceService
  ) {
    this.archivoInput = new ElementRef<HTMLInputElement>(
      document.createElement('input')
    );

    this.formulario = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      valor: [null, [Validators.required]],
    });
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.filearchivo = event.target.files[0];
    }
  }
  @ViewChild('fileInput') fileInput!: ElementRef;

  ngAfterViewInit() {
    console.log('Paginator:', this.paginator);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  activ: Actividad_arch = new Actividad_arch();
  archi: Archivo = new Archivo();

  ngOnInit() {
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
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    this.listar();
    this.restrivalor();
    this.verificarFechaLimite();
  }
  restrivalor() {
    this.actiservis.valor(this.activ.id_actividad).subscribe((data) => {
      this.valorMaximo = data.valor;
    });
  }

  descripcion: string = '';
  valor: number = 0;
  onUpload(): void {
    this.loadingService.show();
    this.archivo
      .cargarpparagad(
        this.filearchivo,
        this.descripcion,
        this.valor,
        this.activ.id_actividad
      )
      .subscribe(
        (event) => {
          this.descripcion = '';
          this.listar();
          this.activ.devengado = this.activ.devengado + this.valor;
          this.restrivalor();
          this.valor = 0;

          console.log('valor =' + this.valor);
          this.loadingService.hide();
          Swal.fire({
            title: '¡Éxito!',
            text: 'El archivo se ha subido correctamente',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        (error) => {
          console.log('Archivo subido:');
          this.loadingService.hide();

          console.error('Error al subir el archivo:', error);
          Swal.fire({
            title: '¡Error!',
            text: 'Nombre del archivo repetido',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    // this.notificar();
    // this.notificaradmin();
  }

  limpiarFormulario() {
    this.isEditing = false;
    this.formulario.reset();
    this.archivon = new Archivo(); // Reset archivo
  }

  listar(): void {
    this.loadingService.show();
    this.archivo
      .getarchivoActividad(this.activ.id_actividad)
      .subscribe((data) => {
        this.aRCHI = data;
        this.dataSource.data = data;
        this.loadingService.hide();
      });
  }

  elim(nom: string, id: any) {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro de que quieres eliminar ' + nom + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminar(nom);
        console.log(id);
        this.eliminarlog(id);
        Swal.fire(
          'Eliminado',
          nom + ' ha sido eliminado correctamente.',
          'success'
        );
      }
    });
  }

  //eliminado de la carpeta
  eliminar(filename: string) {
    this.archivo.borrar(filename).subscribe((res) => {
      this.fileInfos = this.archivo.listar();
    });
  }

  eliminarlog(act: any) {
    this.archivo.eliminar(act).subscribe(
      (response) => {
        this.listar();
        this.restrivalor();
      },
      (error) => {
        console.error('Error al eliminar:', error);
      }
    );
  }

  filterPost = '';

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      // Restaurar los datos originales si no hay filtro aplicado
      this.listar();
    }
  }
  isEditing: boolean = false;

  editar(id_archi: any): void {
    this.archivo
      .editArchivo(
        id_archi,
        this.descripcion,
        this.valor,
        this.activ.id_actividad
      )
      .subscribe(
        (response) => {
          console.log('Archivo editado:', response);

          Swal.fire({
            title: '¡Éxito!',
            text: 'El archivo se ha editado correctamente',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.formulario.reset();
          this.isEditing = false;
          this.listar();
          this.restrivalor();
        },
        (error) => {
          console.error('Error al editar el archivo:', error);

          this.isEditing = false;
          Swal.fire({
            title: '¡Error!',
            text: 'Ocurrió un error al editar el archivo',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
  }

  editDatos(archi: Archivo) {
    this.isEditing = true;
    this.archivon = archi;
    this.formulario = new FormGroup({
      descripcion: new FormControl(archi.descripcion),
      valor: new FormControl(archi.valor),
    });
  }

  //bloquear boton
  botonDeshabilitado: boolean | undefined;

  verificarFechaLimite() {
    this.poaservis.getPoas().subscribe(
      (data) => {
        if (data && data.length > 0) {
          const fechaActual = new Date();
          const fechaFin = new Date(data[0].fecha_fin); // Supongo que estás interesado en la fecha_fin del primer elemento
          console.log('fecha ini >>> ' + fechaActual);
          console.log('fecha fin >>> ' + data[0].fecha_fin);
          console.log('fecha fin 2 >>> ' + fechaFin);

          if (fechaActual > fechaFin) {
            this.botonDeshabilitado = true;
            this.mostrarMensaje(
              'Usted ya no puede subir archivos a esta actividad debido a una fecha límite superada.'
            );
          }
        } else {
          console.error('La lista de POAs está vacía o data es undefined.');
        }
      },
      (error) => {
        console.error('Error al obtener los datos del POA:', error);
        // Puedes manejar el error aquí, mostrar un mensaje de error, etc.
      }
    );
  }

  // Resto del código

  mostrarMensaje(mensaje: string) {
    Swal.fire({
      title: 'Advertencia',
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });
  }
  getEstadoCellStyle(estado: string): any {
    switch (estado) {
      case 'PENDIENTE':
        return { background: 'rgb(235, 253, 133)' };
      case 'APROBADO':
        return { background: 'rgb(168, 216, 159)' };
      case 'RECHAZADO':
        return { background: 'rgb(231, 87, 87)' };
      default:
        return {};
    }
  }
}
