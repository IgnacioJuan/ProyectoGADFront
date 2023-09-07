import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Poa } from 'src/app/models/Poa';
import { LoginService } from 'src/app/services/login.service';
import { PoaService } from 'src/app/services/poa.service';
import { AprobacionPoaService } from 'src/app/services/aprobacion-poa.service';
import { AprobacionPoa } from 'src/app/models/AprobacionPoa';
import { PoasEnviadosProjection } from 'src/app/interface/PoasAdminEnviadosProjection';
import { AprobacionPoasEnviadosProjection } from 'src/app/interface/AprobacionPoaEnviados';

@Component({
  selector: 'app-list-poas-enviados-admin',
  templateUrl: './list-poas-enviados-admin.component.html',
  styleUrls: ['./list-poas-enviados-admin.component.css'],
})
export class ListPoasEnviadosAdminComponent implements OnInit {
  //Listar Poas
  listaPoas: PoasEnviadosProjection[] = [];
  listaAprobacionPoa: AprobacionPoasEnviadosProjection[] = [];

  //Usuario logueado
  user: any = null;
  //tabla
  itemsPerPageLabel = 'Poas por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel = 'Primera';
  previousPageLabel = 'Anterior';
  //Filtro
  estadoSeleccionado: string = 'PENDIENTE';
  public poaSelected = new Poa();
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

  //Columnas Tabla
  columnasObservaciones: string[] = ['observacion', 'estado', 'nombre_completo', 'fecha_aprobacion'];
  columnasUsuario: string[] = [
    'nombre',
    'barrio',
    'cobertura',
    'comunidad',
    'fecha_inicio',
    'fecha_fin',
    'estado',
    'localizacion',
    'observaciones',
  ];
  dataSource = new MatTableDataSource<PoasEnviadosProjection>();
  dataSource3 = new MatTableDataSource<AprobacionPoasEnviadosProjection>();

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private poaService: PoaService,
    public login: LoginService,
    private aprobacionPoaService: AprobacionPoaService
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
  }
  ngOnInit(): void {
    //Capturar usuario logueado
    this.user = this.login.getUser();
    console.log(this.user);
    this.listarPoas(this.user.id, this.estadoSeleccionado);
  }

  //Buscar
  filterPost: string = '';
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;
  resultadosEncontradosporEstado: boolean = true;
  resultadosEncontradosporObservaciones: boolean = true;

  //Metodo para listar
  listarPoas(idAdmin: number, estado: string): void {
    this.poaService.listarPoasAdminEstado(idAdmin, estado).subscribe(
      (data: any[]) => {
        this.listaPoas = data;
        console.log('Dataa');
        console.log(this.listaPoas);
        this.dataSource.data = this.listaPoas;
        this.resultadosEncontradosporEstado = this.listaPoas.length > 0; // Actualiza la variable según si se encontraron resultados
      },
      (error: any) => {
        console.error('Error al listar los poas:', error);
        this.resultadosEncontradosporEstado = false; // Si ocurre un error, no se encontraron resultados
      }
    );
  }

  //Metodo para buscar
  buscar() {
    // Filtra los componentes basados en el filtro
    this.filteredComponentes = this.listaPoas.filter((componente) =>
      componente.barrio.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    // Actualiza los datos del dataSource con los resultados filtrados
    this.dataSource.data = this.filteredComponentes;
    // Verifica si se encontraron resultados
    this.resultadosEncontrados = this.filteredComponentes.length > 0;
  }

  filtrarPorEstado(): void {
    this.listarPoas(this.user.id, this.estadoSeleccionado);
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
  verDetalles(poa: any) {
    this.aprobacionPoaService.listaraaprobacionPorIdPoa(poa.id_poa).subscribe(
      (data: any[]) => {
        this.listaAprobacionPoa = data;
        this.dataSource3.data = this.listaAprobacionPoa;
        this.resultadosEncontradosporObservaciones =
          this.listaAprobacionPoa.length > 0; // Actualiza la variable según si se encontraron resultados
      },
      (error: any) => {
        console.error('Error al listar las observaciones:', error);
        this.resultadosEncontradosporObservaciones = false; // Si ocurre un error, no se encontraron resultados
      }
    );
  }
}
