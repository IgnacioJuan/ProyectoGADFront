import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Objetivoods} from "../../../../models/objetivoods";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {ComponentesService} from "../../../../services/componentes.service";
import {ObjetivoPdotService} from "../../../../services/objetivo-pdot.service";
import {ObjetivoodsService} from "../../../../services/objetivoods.service";
import Swal from "sweetalert2";
import {ArchivoService} from "../../../../services/archivo.service";
import {Archivo} from "../../../../models/Archivo";
import {Poa} from "../../../../models/Poa";
import {AprobacionPoa} from "../../../../models/AprobacionPoa";
import {PoaService} from "../../../../services/poa.service";
import {LoginService} from "../../../../services/login.service";
import {AprobacionPoaService} from "../../../../services/aprobacion-poa.service";
import {AprobacionEvidencia} from "../../../../models/AprobacionEvidencia";
import {AprobacionEvidenciaService} from "../../../../services/aprobacion-evidencia.service";

@Component({
  selector: 'app-evidencias',
  templateUrl: './evidencias.component.html',
  styleUrls: ['./evidencias.component.css']
})
export class EvidenciasComponent implements OnInit {
  //Listar Poas
  listaPoas: Archivo[] = [];
  listaAprobacionPoa: AprobacionEvidencia[] = [];

  //Usuario logueado
  user: any = null;
  //tabla
  itemsPerPageLabel = 'Evidencias por página';
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
  columnasObservaciones: string[] = ['observacion','estadox','fecha_aprobacion','usuario_creacion'];
  columnasUsuario: string[] = [
    'barrio',
    'comunidad',
    'cobertura',
    'fecha_inicio',
    'estado',

    'observaciones',
  ];
  dataSource = new MatTableDataSource<Archivo>();
  dataSource3 = new MatTableDataSource<AprobacionEvidencia>();

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    public login: LoginService,
    private archivoServicio: ArchivoService,
    private AprobacionEvienciaServicio: AprobacionEvidenciaService
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
    console.log(this.estadoSeleccionado);
    this.listarPoas(this.estadoSeleccionado);
  }

  //Buscar
  filterPost: string = '';
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;
  resultadosEncontradosporEstado: boolean = true;
  resultadosEncontradosporObservaciones: boolean = true;

  //Metodo para listar

  listarPoas( estado: string): void {
    this.archivoServicio.listarArchivosPorEstadoYFechaDesc(estado,this.user.username).subscribe(
      (data: any[]) => {
        this.listaPoas = data;
        this.dataSource.data = this.listaPoas;
        this.resultadosEncontradosporEstado = this.listaPoas.length > 0; // Actualiza la variable según si se encontraron resultados
      },
      (error: any) => {
        console.error('Error al listar las evidencias:', error);
        this.resultadosEncontradosporEstado = false; // Si ocurre un error, no se encontraron resultados
      }
    );
  }

  //Metodo para buscar
  buscar() {
    // Filtra los componentes basados en el filtro
    this.filteredComponentes = this.listaPoas.filter((componente) =>
      componente.nombre.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    // Actualiza los datos del dataSource con los resultados filtrados
    this.dataSource.data = this.filteredComponentes;
    // Verifica si se encontraron resultados
    this.resultadosEncontrados = this.filteredComponentes.length > 0;
  }

  filtrarPorEstado(): void {
    this.listarPoas(this.estadoSeleccionado);
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
  verDetalles(evidencia: any) {
    this.AprobacionEvienciaServicio.listaraporbacionEviPorArchivo(evidencia.id_archivo).subscribe(
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


