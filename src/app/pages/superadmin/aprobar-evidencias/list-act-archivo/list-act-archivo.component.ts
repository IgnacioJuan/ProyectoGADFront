import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { Archivos } from 'src/app/models/Archivos';
import { ArchivoService } from 'src/app/services/archivo.service';
import { LoginService } from 'src/app/services/login.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AprobacionEvidenciaService } from 'src/app/services/aprobacion-evidencia.service';
import { AprobacionEvidencia } from 'src/app/models/AprobacionEvidencia';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { Poa } from 'src/app/models/Poa';
import { AprobacionEvidenciaProjection } from 'src/app/interface/AprobacionEvidenciaProjection';
@Component({
  selector: 'app-list-act-archivo',
  templateUrl: './list-act-archivo.component.html',
  styleUrls: ['./list-act-archivo.component.css']
})
export class ListActArchivoComponent implements OnInit {
  listaArchivos: Archivos[] = [];
  listaAprobacionEvi: AprobacionEvidenciaProjection[] = [];

  public aprobarEvi = new AprobacionEvidencia();
  public archivoSeleted = new Archivos();
  //Objeto poa
  poa: Poa = new Poa();
  //Variable para estado
  public estado = "";
  public observacion = "";

  //Usuario logueado
  user: any = null;
  //Objeto actividad
  actividad: ActividadesPoa = new ActividadesPoa();

  //Buscar
  filterPost: string = "";
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;
  isLoggedIn = false;
  fechaActual: Date;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private router: Router,
    private archivoService: ArchivoService,
    private aprobarEvidenciaService: AprobacionEvidenciaService,
    public login: LoginService,

  ) {

    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
    this.fechaActual = new Date();
  }


  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator || null;
  }

  ngOnInit(): void {
    //Obtener id del poa
    const data = history.state.data;
    this.actividad = data;
    this.poa = history.state.poa;
    console.log(this.poa)

    //Capturar usuario logueado
    this.user = this.login.getUser();
    console.log(this.user)
    this.listar(this.actividad.id_actividad);
  }
  //Tabla para listado de archivos
  dataSource2 = new MatTableDataSource<Archivos>();
  //Tabla para listado de obsrvaciones
  dataSource3 = new MatTableDataSource<AprobacionEvidenciaProjection>();
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  //tabla
  itemsPerPageLabel = 'Archivos por página';
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

  columnasArchivos: string[] = ['nombre', 'descripcion', 'estado', 'enlace', 'fecha', 'evaluar', 'verDetalles'];
  columnasObservaciones: string[] = ['observacion', 'estado', 'nombre_completo', 'fecha_aprobacion'];


  seleccionar(archi: Archivos) {
    this.archivoSeleted = archi
    this.estado = this.archivoSeleted.estado;
    //Quitar el usuario 
    this.archivoSeleted.actividad = null;
  }

  listar(activ: number) {
    this.archivoService.listarArchivosPorActividad(activ).subscribe(
      (data: any[]) => {
        this.listaArchivos = data;
        this.dataSource2.data = this.listaArchivos;
      },
      (error: any) => {
        console.error('Error al listar los componentes:', error);
      }
    );
  }

  //Metodo para Rechazar y Aprobar
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


    this.aprobarEvi.estado = this.estado;
    this.aprobarEvi.observacion = this.observacion;
    this.aprobarEvi.evidencia = this.archivoSeleted
    this.aprobarEvi.visible = true;
    this.aprobarEvi.usuario = this.user.id;
    this.aprobarEvi.fecha_aprobacion = this.fechaActual;

    this.archivoSeleted.estado = this.estado;
    // Guardamos la aprobación y actualizamos el estado del archivo en paralelo
    forkJoin([
      this.aprobarEvidenciaService.crear(this.aprobarEvi),
      this.archivoService.actualizar(this.archivoSeleted.id_archivo, this.archivoSeleted)
    ])
      .subscribe(
        ([aprobarResponse, archivoResponse]) => {
          this.Limpiar();
          this.listar(this.actividad.id_actividad);
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con éxito',
            'success'
          );
        },
        (error) => {
          console.error('Error al realizar alguna de las operaciones:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error en una o ambas operaciones',
            'warning'
          );
        }
      );
  }



  buscar() {
    // Filtra los componentes basados en el filtro
    this.filteredComponentes = this.listaArchivos.filter((componente) =>
      componente.nombre.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    // Actualiza los datos del dataSource con los resultados filtrados
    this.dataSource2.data = this.filteredComponentes;
    // Verifica si se encontraron resultados
    this.resultadosEncontrados = this.filteredComponentes.length > 0;
  }

  //Ir a actividades
  verActividades() {
    this.router.navigate(['/sup/aprobarEvidencias/listActividadAprobar'], { state: { data: this.poa } });
  }
  //Ir a POAS
  verPoas() {
    this.router.navigate(['/sup/aprobarEvidencias/listPoaAprobarEvidenciaSuper']);
  }

 //Cambiar colores de la tabkla
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

  //Ver observaciones
  verDetalles(archiv: any) {
    this.archivoSeleted.nombre = archiv.nombre;
    this.aprobarEvidenciaService.listaraporbacionEviPorArchivo(archiv.id_archivo).subscribe(
      (data: any[]) => {
        this.listaAprobacionEvi = data;
        this.dataSource3.data = this.listaAprobacionEvi;
      },
      (error: any) => {
        console.error('Error al listar las observaciones:', error);
      }
    );
  }


}
