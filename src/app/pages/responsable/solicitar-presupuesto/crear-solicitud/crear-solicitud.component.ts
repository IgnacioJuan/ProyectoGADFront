import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit,  ViewChild  } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { ActividadService } from 'src/app/services/actividad.service';
import { LoginService } from 'src/app/services/login.service';
import { Usuario2 } from 'src/app/models/Usuario2';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SolicitudActividadPrepuesto } from 'src/app/models/SolicitudActividadPresupuesto';
import Swal from 'sweetalert2';
import { SolicitudPresupuestoService } from 'src/app/services/solicitud-presupuesto.service';


export class SolicitudActividad {
  nombre: string ="";
  descripcion: string ="";
  detalle: string ="";
  monto_actual: number =0;
  reforma: number =0;
  monto_total: number =0;
}

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit  {
  FormDestinatario: FormGroup;
  FormSolicitud: FormGroup;
  listaUsuarios: Usuario2[] = [];
  //Usuario logueado
  user: any = null;
  usuarioSeleccionado: Usuario2 = new Usuario2();
  datosSolicitud: SolicitudActividad = new SolicitudActividad();
  isLinear = true; // Establece inicialmente el modo lineal como desactivado
  fechaActual: Date;
  //Buscar
  filterPost: string = "";
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;
  listaUsuariosOriginal: any[] = [];
  isDetalleStepEnabled: boolean = false;
  actividadSolicitudPresupuesto: SolicitudActividadPrepuesto = new SolicitudActividadPrepuesto();

  
  columnasActividades: string[] = ['nombre', 'descripcion', 'codificado', 'actions'];
  columnasSolicitud: string[] = ['nombre', 'descripcion', 'monto_actual', 'reforma', 'monto_total' , 'actions'];
  dataActividades = new MatTableDataSource<ActividadesPoa>();
  listaActividades: ActividadesPoa[] = [];
  dataSolicitud = new MatTableDataSource<SolicitudActividad>();
  listaActividadesSeleccionadas: any[] = [];
  detalleActividadesSolicitud: ActividadesPoa[] = [];
  actividadSeleccionada: ActividadesPoa = new ActividadesPoa();

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  //tabla
  itemsPerPageLabel = 'Actividades por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel='Primera';
  previousPageLabel='Anterior';
  rango:any= (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 de ${length}`;
    }
  
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };

 constructor(
  private paginatorIntl: MatPaginatorIntl,
  private actividadesService: ActividadService,
  public login: LoginService,
  private router: Router,
  private userService: UsuarioService,
  private solicitudPresupuestoService: SolicitudPresupuestoService,

) {
  this.paginatorIntl.nextPageLabel = this.nextPageLabel;
  this.paginatorIntl.lastPageLabel = this.lastPageLabel;
  this.paginatorIntl.firstPageLabel=this.firstPageLabel;
  this.paginatorIntl.previousPageLabel=this.previousPageLabel;
  this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
  this.paginatorIntl.getRangeLabel=this.rango;
  this.fechaActual = new Date();
  this.FormDestinatario = new FormGroup({
    cedula: new FormControl({ value: '', disabled: false }, Validators.required),
    nombre: new FormControl({ value: '', disabled: false }, Validators.required),
    cargo: new FormControl({ value: '', disabled: false }, Validators.required),
    correo: new FormControl({ value: '', disabled: false }, Validators.required),
    detalle: new FormControl({ value: '', disabled: false }, Validators.required),
  });
  this.FormSolicitud = new FormGroup({
    id_actividad: new FormControl({ value: '', disabled: false }, Validators.required),
    nombre: new FormControl({ value: '', disabled: false }, Validators.required),
    descripcion: new FormControl({ value: '', disabled: false }, Validators.required),
    monto_actual: new FormControl({ value: '', disabled: false }, Validators.required),
    reforma: new FormControl({ value: '', disabled: false }, Validators.required),
    monto_total: new FormControl({ value: '', disabled: true }, Validators.required),
    tipo: new FormControl({ value: '', disabled: false }, Validators.required),
  });

}

 ngAfterViewInit() {
  this.dataActividades.paginator = this.paginator || null;}

  ngOnInit(): void {
    this.cargarUsuarios();
  //Capturar usuario logueado
  this.user = this.login.getUser();
  console.log(this.user)
  this.listar(this.user.id);
  }


  cargarUsuarios() {
    this.userService.getUsuariosList().subscribe(
      (data: Usuario2[]) => {
        this.listaUsuarios = data;
        this.listaUsuariosOriginal = this.listaUsuarios.slice();
      },
      (error: any) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }


 

  SeleccionarUsuario(elemento: any): void {
    this.usuarioSeleccionado=elemento
    this.FormDestinatario.patchValue({
      cedula: elemento.persona.cedula,
      nombre: elemento.persona.primer_nombre,
      cargo: elemento.persona.cargo,
      correo: elemento.persona.correo
    });}
  
 



AgregarDestinatario(){
  this.datosSolicitud.detalle=this.FormDestinatario.value.detalle}

  listar(idUser: number): void {
    this.actividadesService.listaractireponsa(idUser).subscribe(
      (data: any[]) => {
        this.listaActividades = data;
        this.dataActividades.data = this.listaActividades;
      },
      (error: any) => {
        console.error('Error al listar los componentes:', error);
      }
    );
  }


  SeleccionarActividad(elemento: any): void {
    this.FormSolicitud.patchValue({
      id_actividad: elemento.id_actividad,
      nombre: elemento.nombre,
      descripcion: elemento.descripcion,
      monto_actual: elemento.codificado,
    });
  }
  
  AddActividad() {
    if (this.FormSolicitud.value.tipo) {
      this.FormSolicitud.value.monto_total = this.FormSolicitud.value.reforma + this.FormSolicitud.value.monto_actual;
    } else {
      this.FormSolicitud.value.monto_total = this.FormSolicitud.value.monto_actual - this.FormSolicitud.value.reforma;
    }
  
    this.listaActividadesSeleccionadas.push(this.FormSolicitud.value);
    console.log(this.detalleActividadesSolicitud);
    console.log(this.listaActividadesSeleccionadas);
    this.dataSolicitud.data = this.listaActividadesSeleccionadas;
    this.FormSolicitud.reset();
if (this.dataSolicitud.data.length > 0) {
  this.isDetalleStepEnabled = true;
} else {
  this.isDetalleStepEnabled = false;
}


  }
  




  usuariosdit: Usuario2 = new Usuario2;





  guardar() {
    this.usuariosdit.id = this.usuarioSeleccionado.id;
    this.actividadSolicitudPresupuesto.motivo = this.datosSolicitud.detalle;
    this.actividadSolicitudPresupuesto.fecha_solicitud = this.fechaActual;
    this.actividadSolicitudPresupuesto.destinatario = this.usuariosdit;
    this.actividadSolicitudPresupuesto.responsable = this.user.id;
  
    for (const actividadSeleccionada of this.listaActividadesSeleccionadas) {
      const solicitudActividad = new SolicitudActividadPrepuesto();
      solicitudActividad.motivo = this.actividadSolicitudPresupuesto.motivo;
      solicitudActividad.monto_actual = actividadSeleccionada.monto_actual;
      solicitudActividad.reforma = actividadSeleccionada.reforma;
      solicitudActividad.monto_total = actividadSeleccionada.monto_total;
      solicitudActividad.fecha_solicitud = this.actividadSolicitudPresupuesto.fecha_solicitud;
      solicitudActividad.destinatario = this.actividadSolicitudPresupuesto.destinatario;
      solicitudActividad.responsable = this.actividadSolicitudPresupuesto.responsable;
      solicitudActividad.actividadSolicitud = actividadSeleccionada; 
  
      this.solicitudPresupuestoService.crear(solicitudActividad) .subscribe(
          (response) => {
            console.log('Solicitud de actividad con éxito:', response);
            Swal.fire(
              'Exitoso',
              'Se ha completado el registro con éxito',
              'success'
            );
            setTimeout(() => {
              this.router.navigate(['/res/solicitar-presupuestos/listSolicitudes']);
            }, 500); 
          },
          (error) => {
            console.error('Error al crear la solicitud de actividad:', error);
            Swal.fire(
              'Error',
              'Ha ocurrido un error',
              'warning'
            );
          }
        );
    }
  }


  Eliminar(elemento: any) {
    this.dataSolicitud.data = this.dataSolicitud.data.filter(item => item !== elemento);
    this.listaActividadesSeleccionadas = this.listaActividadesSeleccionadas.filter(item => item !== elemento);
    if (this.dataSolicitud.data.length > 0) {
      this.isDetalleStepEnabled = true;
    } else {
      this.isDetalleStepEnabled = false;
    }
    
  }
  

ListadoSolicitud(){
  this.router.navigate(['/res/solicitar-presupuestos/listSolicitudes']);}

  buscar() {
    this.filteredComponentes = this.listaUsuariosOriginal.filter((componente) =>
      componente.persona.primer_nombre.toLowerCase().includes(this.filterPost.toLowerCase()) || componente.persona.cedula.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    this.listaUsuarios = this.filteredComponentes;
    this.resultadosEncontrados = this.filteredComponentes.length > 0; }
    
    isDataSolicitudNotEmpty() {
      return this.dataSolicitud.data.length > 0;
    }
  
}
