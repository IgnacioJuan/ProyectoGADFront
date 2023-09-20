import {Component, OnInit, ViewChild} from '@angular/core';
import {PoasIndicadoresProjection} from "../../../../interface/PoasIndicadoresProjection";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {MetasPdotService} from "../../../../services/metas-pdot.service";
import {LoadingServiceService} from "../../../../components/loading-spinner/LoadingService.service";
import {PoaService} from "../../../../services/poa.service";
import {MatTableDataSource} from "@angular/material/table";
import {ProyectoService} from "../../../../services/proyecto.service";
import {ReporteProyecto} from "../../../../interface/reporte-proyecto";

@Component({
  selector: 'app-reporte-proyecto',
  templateUrl: './reporte-proyecto.component.html',
  styleUrls: ['./reporte-proyecto.component.css']
})
export class ReporteProyectoComponent implements OnInit {
  //Buscar
  filterPost: string = "";
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;
  ///////
  listaPoasIndicadores: ReporteProyecto[] = [];
  constructor(
    private paginatorIntl: MatPaginatorIntl,
    //importar el spinner como servicio

    //proyecto servicio para listar el proyecto
    private ProyectoServicio: ProyectoService,
    private loadingService: LoadingServiceService,
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
    this.listar();
  }
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

//tabla
  itemsPerPageLabel = 'Proyectos por página';
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
//Columnas Tabla
  dataSource = new MatTableDataSource<ReporteProyecto>();

  columnasUsuario: string[] = [ 'nombre_proyecto', 'tipo_periodo','tipo_evaluacion', 'porcentaje_cumplimiento'];
  listar(): void {
    this.loadingService.show();

    this.ProyectoServicio.obtenerReportePresupuesto().subscribe(
      (data: any[]) => {
        this.listaPoasIndicadores = data;
        this.dataSource.data = this.listaPoasIndicadores;
        this.loadingService.hide();

      },
      (error: any) => {
        console.error('Error al listar los objetivos:', error);
        this.loadingService.hide();

      }
    );
  }

  getColorClass(porcentaje: number): string {
    if (porcentaje < 70.0) {
      return 'rojo';
    } else if (porcentaje >= 70.0 && porcentaje <= 84.9) {
      return 'amarillo';
    } else {
      return 'verde';
    }
  }




}
