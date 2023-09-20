import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { CompetenciaService } from 'src/app/services/competencia.service';
import { ReportICompetencia } from 'src/app/models/ReportICompetencia';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte-especifico-competencia',
  templateUrl: './reporte-especifico-competencia.component.html',
  styleUrls: ['./reporte-especifico-competencia.component.css'],
})
export class ReporteEspecificoCompetenciaComponent {
  rCompentencias!: ReportICompetencia[];
  pdfUrl!: SafeResourceUrl;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private competenciaService: CompetenciaService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
    this.cargarDataRICompetencias();
  }

  ngAfterViewInit() {
    this.tableData.paginator = this.paginator || null;
  }

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  //tabla
  itemsPerPageLabel = 'Monto Competencia por página';
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
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: [
      'ejemplo',
      'ejemplo1',
      'ejemplo2',
      'ejemplo3',
      'ejemplo4',
      'ejemplo5',
      'ejemplo6',
      'ejmplo',
      'ejemplo1',
      'ejemplo2',
      'ejemplo3',
      'ejemplo4',
      'ejemplo5',
      'ejemplo6',
    ],
    datasets: [
      { data: [89, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [66, 48, 40, 19, 86, 27, 90], label: 'Series B' },
      { data: [28, 48, 70, 19, 86, 8, 90], label: 'Porcentaje' },
    ],
  };

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public randomize(): void {
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40,
    ];

    this.chart?.update();
  }
  // Datos para la tabla
  tableData = new MatTableDataSource(this.prepareTableData());
  // Columnas a mostrar
  displayedColumns: string[] = ['year', 'seriesA', 'seriesB', 'porcentaje'];

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
  cargarDataRICompetencias() {
    this.competenciaService.obtenerReportesICompetencias().subscribe((data) => {
      this.rCompentencias = data;
      console.log('Data:', this.rCompentencias);
    });
  }
  cargarPDF() {
    this.competenciaService.obtenerPDF().subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const unsafeUrl = URL.createObjectURL(blob);
      console.log('Unsafe URL:', unsafeUrl);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    });
  }
  redirectToPDF() {
    window.open('http://localhost:5000/api/competencia/export-pdf', '_blank');
  }
}
