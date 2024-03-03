import { usuario } from '../../../../models/Usuario';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { ModeloPoa } from 'src/app/models/ModeloPoa';
import { Proyecto } from 'src/app/models/Proyecto';
import { ProyectoService } from 'src/app/services/proyecto.service';


@Component({
  selector: 'app-listaproyecto',
  templateUrl: './listaproyecto.component.html',
  styleUrls: ['./listaproyecto.component.css']
})
export class ProyectosComponent {
  guardadoExitoso: boolean = false;
  //tabla
  itemsPerPageLabel = 'Proyectos por página';
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
  //
  modelopoa: ModeloPoa = new ModeloPoa();
  proyectos: any[] = [];

  public subcrite = new Proyecto();
  subcriterios: Proyecto[] = [];

  filterPost: string = "";
  filteredComponentes: any[] = [];
  resultadosEncontrados: boolean = true;

  ocultar = false;

  dataSource = new MatTableDataSource<Proyecto>();
  columnasUsuario: string[] = ['id_proyecto', 'nombre', 'codigo', 'objetivo', 'meta', 'poa'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  fechaMinima: string = "";
  fechaMax: string = "";
  selectedCodigo: string = "";
  constructor(
    private proyectoservice: ProyectoService,
    private paginatorIntl: MatPaginatorIntl,
    private router: Router,
    private loadingService: LoadingServiceService

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
  ngOnInit() {

    this.listar()
  }
  //optimizar
  listar(): void {
    this.loadingService.show();

    this.proyectoservice.getProyectos().subscribe(
      (data: any[]) => {
        this.proyectos = data;
        this.dataSource.data = this.proyectos;
        this.loadingService.hide();

      },
      (error: any) => {
        console.error('Error al listar los proyectos:', error);

        this.loadingService.hide();

      }
    );
  }
  verDetalles(proyecto: any) {
    this.router.navigate(['/sup/flujo-criterio/listarpoausu'], { state: { proyecto: proyecto, modelo: this.modelopoa } });
  }
  verProyectos() {
    this.router.navigate(['/sup/flujo-criterio/listaproyecto']);
  }

  buscar() {
    this.filteredComponentes = this.proyectos.filter((componente) =>
      componente.nombre.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    this.dataSource.data = this.filteredComponentes;
    this.resultadosEncontrados = this.filteredComponentes.length > 0;
  }

}