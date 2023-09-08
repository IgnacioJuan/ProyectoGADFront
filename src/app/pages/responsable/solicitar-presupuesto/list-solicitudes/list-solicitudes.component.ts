import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SolicitudesPresupuestoProjection } from 'src/app/interface/SolicitudesPresupuestos.Projection';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { SolicitudActividadPrepuesto } from 'src/app/models/SolicitudActividadPresupuesto';
import { ActividadService } from 'src/app/services/actividad.service';
import { LoginService } from 'src/app/services/login.service';
import { SolicitudPresupuestoService } from 'src/app/services/solicitud-presupuesto.service';

@Component({
  selector: 'app-list-solicitudes',
  templateUrl: './list-solicitudes.component.html',
  styleUrls: ['./list-solicitudes.component.css']
})
export class ListSolicitudesComponent implements OnInit {

  //tabla
  itemsPerPageLabel = 'Solicitudes por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel='Primera';
  previousPageLabel='Anterior';
  estadoSeleccionado: string = 'PENDIENTE';
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

  listaSolicitudes: SolicitudesPresupuestoProjection[] = [];
  resultadosEncontradosporEstado: boolean = true;

    //Usuario logueado
    user: any = null;
  //Buscar
  filterPost: string = "";
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;

  dataSource = new MatTableDataSource<SolicitudesPresupuestoProjection>();

  columnasUsuario: string[] = ['actividad_nombre','responsable', 'destinatario', 'estado', 'fecha_solicitud', 'actions'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    public login: LoginService,
    private router: Router,
    private solicitudPresupuestoService: SolicitudPresupuestoService,


  ) {
 
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit(): void {
      //Capturar usuario logueado
      this.user = this.login.getUser();
    this.listarSolicitudes(this.user.id, this.estadoSeleccionado);
      
  }
  
 


//Metodo para listar
listarSolicitudes(idResponsable: number, estado: string): void {
  this.solicitudPresupuestoService.listarSolicitudesResponsableEstado(idResponsable, estado).subscribe(
    (data: any[]) => {
      this.listaSolicitudes = data;
      console.log('Dataa');
      console.log(this.listaSolicitudes);
      this.dataSource.data = this.listaSolicitudes;
      this.resultadosEncontradosporEstado = this.listaSolicitudes.length > 0; // Actualiza la variable según si se encontraron resultados
    },
    (error: any) => {
      console.error('Error al listar los poas:', error);
      this.resultadosEncontradosporEstado = false; // Si ocurre un error, no se encontraron resultados
    }
  );
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




  buscar() {
    this.filteredComponentes = this.listaSolicitudes.filter((componente) =>
      componente.actividad.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    this.dataSource.data = this.filteredComponentes;
    this.resultadosEncontrados = this.filteredComponentes.length > 0;
  }
  irCrearSolicitud() {
    this.router.navigate(['/res/solicitar-presupuestos/crearSolicitudes']);
  }
  filtrarPorEstado(): void {
    this.listarSolicitudes(this.user.id, this.estadoSeleccionado);
  }
  
}
