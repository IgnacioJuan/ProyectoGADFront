import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ReportICompetencia } from 'src/app/models/ReportICompetencia';
import { LoadingServiceService } from 'src/app/components/loading-spinner/LoadingService.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ReportIPrograma } from 'src/app/models/ReportIPrograma';
import { ProgramaService } from 'src/app/services/programa.service';

Chart.register(DataLabelsPlugin);


@Component({
  selector: 'app-reporte-programas',
  templateUrl: './reporte-programas.component.html',
  styleUrls: ['./reporte-programas.component.css']
})
export class ReporteProgramasComponent implements OnInit{
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  rProgramas!: ReportIPrograma[];
  resultadosEncontradosporEstado: boolean = true;
  pdfUrl!: SafeResourceUrl;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private loadingService: LoadingServiceService,
    private sanitizer: DomSanitizer,
    private programaService: ProgramaService,
    private router: Router
  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
    this.cargarDataRIProgramas();
  }
  ngOnInit(): void {
    this.cargarDataRIProgramas();
  }
  ngAfterViewInit() {
    this.tableData.paginator = this.paginator || null;
  }

  //tabla
  itemsPerPageLabel = 'Programas por página';
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

  //**Gráfica de lineas*/ 
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: { // Eje Y izquierdo para valores en millones
        display: false,
        title: {
          display: true,
          text: 'Millones'
        },
        position: 'left',
        ticks: {
          callback: function (value) {
            return value + 'M';// Agrega el símbolo 'M' para millones
          }
        }
      },
      y1: { // Eje Y derecho para porcentajes
        title: {
          display: true,
          text: ''
        },
        position: 'right',
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: function (value) {
            return value + '%'; // Agrega el símbolo de porcentaje
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'black',
        formatter: (value, context) => {
          // Verifica si context.dataset.label existe
          if (!context.dataset.label) {
            return value;
          }
          // Si es el conjunto de datos de porcentaje
          if (context.dataset.label === 'Porcentaje') {
            return value.toFixed(2) + '%';  // Formatea con dos decimales y añade '%'
          } else if (['Codificado', 'Devengado'].includes(context.dataset.label)) {
            return '$ ' + value;  // Formatea con dos decimales y añade 'M' para millones
          }
          return value;
        }
      }
    }
  };

  public barChartType: ChartType = 'bar'; // Mantén esto como 'bar'

  public barChartData: ChartData<'bar' | 'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Porcentaje',
        type: 'line',
        yAxisID: 'y1', // Asigna el eje Y derecho
        borderColor: 'red',
        borderWidth: 3,
      },
      {
        data: [],
        label: 'Codificado',
        type: 'bar',
        yAxisID: 'y', // Asigna el eje Y izquierdo
        backgroundColor: 'green',
      },
      {
        data: [],
        label: 'Devengado',
        type: 'bar',
        yAxisID: 'y', // Asigna el eje Y izquierdo
        backgroundColor: 'yellow',
      }

    ],
  };

  actualizarGrafica(data: ReportIPrograma[]) {
    const nombres = data.map(item => item.nombre.length > 32 ? item.nombre.substring(0, 32) + '...' : item.nombre);
    const porcentajes = data.map(item => item.porc_ejecucion);
    const codificados = data.map(item => item.codificado); // Divide por un millón para ajustar la escala
    const devengados = data.map(item => item.devengado); // Divide por un millón para ajustar la escala

    this.barChartData.labels = nombres;
    this.barChartData.datasets[0].data = porcentajes;
    this.barChartData.datasets[1].data = codificados;
    this.barChartData.datasets[2].data = devengados;

    this.chart?.update();
  }
  // Datos para la tabla
  tableData = new MatTableDataSource<ReportIPrograma>();
  // Columnas a mostrar
  displayedColumns: string[] = [
    'nombre',
    'codificado',
    'devengado',
    'porc_ejecucion',
  ];
  footerColumns = [
    'footer',
    'footerCodificado',
    'footerDevengado',
    'footerPorent',
  ];
  prepareTableData() {
    const data = [];
    if (this.barChartData.labels && this.barChartData.datasets) {
      for (let i = 0; i < this.barChartData.labels.length; i++) {
        data.push({
          year: this.barChartData.labels[i],
          seriesA: this.barChartData.datasets[0].data[i],
          seriesB: this.barChartData.datasets[1].data[i],
          porcentaje: this.barChartData.datasets[2].data[i],
        });
      }
    }
    return data;
  }
  getColorClass(porcentaje: number): string {
    if (porcentaje < 70.0) {
      return 'rojo';
    } else if (porcentaje >= 70.0 && porcentaje <= 84.9) {
      return 'amarillo';
    } else if (porcentaje >= 85) {
      return 'verde';
    } else {
      return '';
    }
  }
  getTotalCodificado() {
    return this.tableData.data
      .map((t: any) => t.codificado)
      .reduce((acc: number, value: number) => acc + value, 0);
  }
  getTotalDevengado() {
    return this.tableData.data
      .map((t: any) => t.devengado)
      .reduce((acc: number, value: number) => acc + value, 0);
  }
  getExecutionPercentage(): number {
    const totalCodificado = this.getTotalCodificado();
    const totalDevengado = this.getTotalDevengado();

    if (totalCodificado === 0) {
      return 0; // Avoid division by zero
    }

    return (totalDevengado / totalCodificado) * 100;
  }

  cargarDataRIProgramas() {
    this.loadingService.show();
    this.programaService.obtenerReportesIProgramas().subscribe(
      (data: ReportIPrograma[]) => {
        this.rProgramas = data;
        this.tableData.data = this.rProgramas;
        this.resultadosEncontradosporEstado = this.rProgramas.length > 0;

        this.actualizarGrafica(this.rProgramas);
        console.log(this.rProgramas);
        this.loadingService.hide();
      },
      (error: ReportIPrograma) => {
        console.error('Error al listar los programas:', error);
        this.loadingService.hide();
        this.resultadosEncontradosporEstado = false;
      }
    );
  }
  
  
  cargarPDF() {
    this.loadingService.show();
    this.programaService.obtenerPDF().subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const unsafeUrl = URL.createObjectURL(blob);
      this.loadingService.hide();
      console.log('Unsafe URL:', unsafeUrl);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    });
  }

  filtrarPorColor(color: string) {
    switch (color) {
      case 'verde':
        this.tableData.data = this.rProgramas.filter(item => item.porc_ejecucion >= 85);
        break;
      case 'amarillo':
        this.tableData.data = this.rProgramas.filter(item => item.porc_ejecucion >= 70 && item.porc_ejecucion <= 84.9);
        break;
      case 'rojo':
        this.tableData.data = this.rProgramas.filter(item => item.porc_ejecucion < 70);
        break;
      default:
        this.tableData.data = this.rProgramas;
        break;
    }
  }

  resetFiltro() {
    this.tableData.data = this.rProgramas;
  }

  rowClicked(programId: ReportIPrograma) {
    console.log("Pasando programa:", programId);
    this.router.navigate(['/repor/reporteProgramas/reportePProyecto', programId.id_programa], {
      state: { programa: programId }
    });
  }
}
