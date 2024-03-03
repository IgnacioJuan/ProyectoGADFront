import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ActividadesPoa } from 'src/app/models/ActividadesPoa';
import { Poa } from 'src/app/models/Poa';
import { ActividadespoaService } from 'src/app/services/actividadespoa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { PresupuestoExterno } from 'src/app/models/PresupuestoExterno';
import { ReformaSuplemento } from 'src/app/models/ReformaSuplemento';
import { ReformaTraspasoI } from 'src/app/models/ReformaTraspasoI';
import { ReformaTraspasoD } from 'src/app/models/ReformaTraspasoD';
import { PresupuestoExternoService } from 'src/app/services/presupuestoexterno.service';
import { ReformaSuplementoService } from 'src/app/services/reformasuplemento.service';
import { ReformaTraspasoIService } from 'src/app/services/reformatraspaso-i.service';
import { ReformaTraspasoDService } from 'src/app/services/reformatraspaso-d.service';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { presupuestPeriodoProjection } from 'src/app/interface/presupuestPeriodoProjection';
import { totalPresupuestoGeneralProjection } from 'src/app/interface/totalPresupuestoGeneralProjection';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ListaActividadesComponent implements OnInit {

  act!: ActividadesPoa[];
  ocultar = false;

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
  //
  poa: any;
  actividades: any = [];
  miModal!: ElementRef;
  ocultarID: boolean = false;
  public actividad = new ActividadesPoa();



  poaId!: number;

  filterPost: string = "";
  resultadosEncontrados: boolean = true;

  dataSource = new MatTableDataSource<ActividadesPoa>();
  columnasObservaciones: string[] = ['referencia', 'porcentaje', 'inversion', 'ejecucion'];

  columnasUsuario: string[] = ['id_actividad', 'nombre', 'presupuesto_referencial', 'recursos_propios', 'codificado', 'devengado', 'actions'];

  columnasperiodotot: string[] = ['referencia', 'fechai', 'inversion', 'ejecucion'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private actividadservice: ActividadespoaService, private paginatorIntl: MatPaginatorIntl,
    private periodoService: PeriodoService,
    private router: Router, private fb: FormBuilder, private userService: UsuarioService, private loadingService: LoadingServiceService,
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
    const data = history.state.data;
    this.poa = data;
    this.listar(this.poa.id_poa);
  }


  //PETICIONES | RUTAS
  verPoas() {
    this.router.navigate(['/adm/presup-ejecut/tabla-poas']);
  }

  listar(poaId: number): void {
    this.loadingService.show();
    this.dataSource.data = [];
    this.actividadservice.getActividadesPoa2(poaId).subscribe(
      (data: any[]) => {
        this.verDetalless()
        this.actividades = data;
        this.dataSource.data = data;
        console.log(data)
      },
      (error: any) => {
        this.loadingService.hide();

        console.error('Error al listar las actividades:', error);
      }
    );
  }
  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.actividades;
    }
  }

  listaPeriodos: presupuestPeriodoProjection[] = [];
  listaPeriodostotal: totalPresupuestoGeneralProjection[] = [];

  periodotot = new MatTableDataSource<totalPresupuestoGeneralProjection>();
  dataSource3 = new MatTableDataSource<presupuestPeriodoProjection>();
  resultadosEncontradosporObservaciones: boolean = true;

  //Ver observaciones
  verDetalles(actividad: any) {
    this.loadingService.show();

    this.periodoService.presupuestoGeneral(actividad.id_actividad).subscribe(
      (data: any) => {
        this.listaPeriodos = data;
        this.loadingService.hide();

        // Calcula los totales
        const totales = this.calcularTotales(this.listaPeriodos);

        // Agrega los totales al final del arreglo
        this.listaPeriodos.push(totales);

        // Asigna el arreglo con los totales a dataSource3
        this.dataSource3.data = this.listaPeriodos;

        this.resultadosEncontradosporObservaciones =
          this.listaPeriodos.length > 0; // Actualiza la variable según si se encontraron resultados
      },
      (error: any) => {
        this.loadingService.hide();

        console.error('Error al listar las observaciones:', error);
        this.resultadosEncontradosporObservaciones = false; // Si ocurre un error, no se encontraron resultados
      }
    );
  }

  // Función para calcular los totales
  calcularTotales(listaPeriodos: any[]): any {
    const totales = {
      // Define aquí las propiedades de los totales y sus valores iniciales
      referencia: 'Totales',
      porcentaje: 0,
      inversion: 0,
      ejecucion: 0,
    };

    for (const periodo of listaPeriodos) {
      // Realiza las operaciones de suma para cada propiedad
      totales.porcentaje += periodo.porcentaje;
      totales.inversion += periodo.inversion;
      totales.ejecucion += periodo.ejecucion;
    }

    // Puedes realizar otras operaciones necesarias aquí

    return totales;
  }
  esUltimoElemento(index: number): boolean {
    return index === this.listaPeriodos.length - 1;
  }
  esUltimoElemento2(index: number): boolean {
    return index === this.listaPeriodostotal.length - 1;
  }
  verDetalless() {

    this.periodoService.totalPresupuestoGeneral(this.poa.id_poa).subscribe(
      (data: any) => { // Observa que ahora esperamos un arreglo de TotalPresupuestoGeneralProjection
        this.listaPeriodostotal = data;
        this.loadingService.hide();

        // Calcula los totales
        const totales = this.calcularTotaless(this.listaPeriodostotal);

        // Agrega los totales al final del arreglo
        this.listaPeriodostotal.push(totales);

        // Asigna el arreglo con los totales a dataSource3
        this.periodotot.data = this.listaPeriodostotal;
        console.log(this.periodotot.data)
        this.resultadosEncontradosporObservaciones =
          this.listaPeriodostotal.length > 0; // Actualiza la variable según si se encontraron resultados
      },
      (error: any) => {
        this.loadingService.hide();

        console.error('Error al listar las observaciones:', error);
        this.resultadosEncontradosporObservaciones = false; // Si ocurre un error, no se encontraron resultados
      }
    );
  }

  // Modifica el método calcularTotales para usar la interfaz
  calcularTotaless(listaPeriodostotal: any[]): any {
    const totales = {
      referencia: 'Totales',
      periodoInicio: '',
      periodoFin: 'Totales',
      inversion: 0,
      ejecucion: 0,
    };

    for (const periodo of listaPeriodostotal) {
      totales.inversion += periodo.inversion;
      totales.ejecucion += periodo.ejecucion;
    }

    return totales;
  }
}
