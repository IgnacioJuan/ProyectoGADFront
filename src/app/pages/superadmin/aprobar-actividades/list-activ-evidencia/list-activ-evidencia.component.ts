import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ActividadespoaService } from 'src/app/services/actividadespoa.service';
import { Archivos } from 'src/app/models/Archivos';
import { LoginService } from 'src/app/services/login.service';
import { Poa } from 'src/app/models/Poa';
import Swal from 'sweetalert2';
import { AprobacionActividadService } from 'src/app/services/aprobacion-actividad.service';
import { AprobacionActividad } from 'src/app/models/AprobacionActividad';
import { Usuario2 } from 'src/app/models/Usuario2';
import { AprobacionporActividadProjection } from 'src/app/interface/AprobacionporActividadProjection';
@Component({
  selector: 'app-list-activ-evidencia',
  templateUrl: './list-activ-evidencia.component.html',
  styleUrls: ['./list-activ-evidencia.component.css']
})
export class ListActivEvidenciaComponent implements OnInit {
  //Listar actividades-acrchivos-acitividad seleccionada
  public actividadSe = new ActividadesPoa();
  listaActividades: ActividadesPoa[] = [];

  public aprobarAct = new AprobacionActividad();
  public actividadSelected :any;
  listaAprobacionAct: AprobacionporActividadProjection[] = [];

  observacionsSource = new MatTableDataSource<AprobacionporActividadProjection>();

  //Usuario logueado
  //Variable para estado
  public estado = "";
  public observacion = "";

  //Usuario logueado
  user: any = null;
  isLoggedIn = false;
  //Objeto poa
  poa: Poa = new Poa();

  //Buscar
  filterPost: string = "";
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private router: Router,
    private actividadService: ActividadespoaService,
    private aprobacionActvidadService: AprobacionActividadService,
    public login: LoginService,

  ) {

    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
    this.dataSource2.paginator = this.paginator || null;

  }
  ngOnInit(): void {
    //Obtener id del poa
    const data = history.state.data;
    this.poa = data;
    if (this.poa == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    //Capturar usuario logueado
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    this.listar();
  }
  //Tabla para listado de actividades
  dataSource = new MatTableDataSource<ActividadesPoa>();
  //Tabla para listado de archivos
  dataSource2 = new MatTableDataSource<Archivos>();

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) paginatorobs?: MatPaginator;

  //tabla
  itemsPerPageLabel = 'Items por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel = 'Primera';
  previousPageLabel = 'Anterior';
  rango: any = (page: number, pageSize: number, length: number) => {
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
  //Columnas tabla actividades
  columnasUsuario: string[] = ['id_actividad', 'nombre', 'descripcion', 'responsable', 'detalle', 'evaluar', 'historial'];
  columnasObservaciones: string[] = ['observacion', 'estado', 'nombre_completo', 'fecha_aprobacion'];

  listar(): void {
    this.actividadService.ActividadesPendientesPorPoa(this.poa.id_poa).subscribe(
      (data: any[]) => {
        this.listaActividades = data;
        console.log("Dataa")
        console.log(this.listaActividades)
        this.dataSource.data = this.listaActividades;
      },
      (error: any) => {
        console.error('Error al listar los objetivos:', error);
      }
    );
  }


  guardar() {
  
    // Verificar si el estado es "RECHAZADO" y la observación está vacía
    if (this.estado === 'RECHAZADO' && !this.observacion) {
      Swal.fire(
        'Advertencia',
        'La observación es obligatoria ',
        'warning'
      );
      return;
    }
  
  
      this.aprobarAct.estado = this.estado;
      this.aprobarAct.observacion = this.observacion;
      this.aprobarAct.visible = true;
      this.aprobarAct.usuario = this.user.id;
      this.aprobarAct.poa = this.poa;
      this.aprobarAct.actividad=this.actividadSelected;
      this.aprobarAct.poa.usuario=new Usuario2();
      this.aprobarAct.actividad.usuario=new Usuario2();
      console.log(this.aprobarAct)
      this.aprobacionActvidadService.crear(this.aprobarAct)
        .subscribe(
          () => {
            this.Limpiar();
            this.listar();
            Swal.fire(
              'Exitoso',
              'Se ha completado el registro con éxito',
              'success'
            );
          },
          (error) => {
            Swal.fire(
              'Error',
              'Ha ocurrido un error al realizar la operacion ...',
              'warning'
            );
          }
        );
    }
  
  
    seleccionar(archi: Archivos) {
      this.actividadSelected = archi
      this.estado = this.actividadSelected.estado;
      //Quitar el usuario 
      this.actividadSelected.actividad = null;
    }

  buscar() {
    // Filtra los componentes basados en el filtro
    this.filteredComponentes = this.listaActividades.filter((componente) =>
      componente.nombre.toLowerCase().includes(this.filterPost.toLowerCase())
    );

    // Actualiza los datos del dataSource con los resultados filtrados
    this.dataSource.data = this.filteredComponentes;

    // Verifica si se encontraron resultados
    this.resultadosEncontrados = this.filteredComponentes.length > 0;
  }

  verDetalles(actividad: any) {
    this.aprobacionActvidadService.listarAprobacionesporActividad(actividad.id_actividad).subscribe(
      (data: any[]) => {
        this.listaAprobacionAct = data;
        this.observacionsSource.data = this.listaAprobacionAct;
        this.observacionsSource.paginator = this.paginatorobs  || null;

      },
      (error: any) => {
        console.error('Error al listar las observaciones:', error);
      }
    );
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
  //Ir a poas
  verPoas() {
    this.router.navigate(['/sup/aprobar-actividades/poa-actividad']);
  }

  Rechazar() {
    this.estado = "RECHAZADO"
  }
  Aprobar() {
    this.estado = "APROBADO"

  }
  Limpiar() {
    this.estado = "";
    this.observacion = "";
  }
  limpiarObservacion(){
    this.observacionsSource =  new MatTableDataSource<AprobacionporActividadProjection>();
  }
}
