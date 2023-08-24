import { trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition } from '@angular/animations';
import { Indicador } from 'src/app/models/Indicador';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CalificacionComponent } from './calificacion/calificacion.component';
import Swal from 'sweetalert2';
import { Criterio } from 'src/app/models/Criterio';
import { Modelo } from 'src/app/models/Modelo';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

type Columnname = {
  [key: string]: string;
}

@Component({
  selector: 'app-matriz-evaluacion',
  templateUrl: './matriz-evaluacion.component.html',
  styleUrls: ['./matriz-evaluacion.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class MatrizEvaluacionComponent implements OnInit {
  itemsPerPageLabel = 'Indicadores por página';
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

  public columnNames: Columnname = {
    nombre: 'Nombre del Indicador',
    descripcion: 'Descripción del Indicador',
    tipo: 'Tipo',
    valor_obtenido: 'Valor Obtenido'
  };

  dataSource = new MatTableDataSource<any>();

  columnsToDisplay = ['nombre', 'descripcion', 'tipo', 'valor_obtenido'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'evaluar'];
  expandedElement: any;
  idcriterio: Criterio = new Criterio();
  idmodelo: Modelo = new Modelo();
  indicador: Indicador = new Indicador();

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  constructor(
    private route: Router,private paginatorIntl: MatPaginatorIntl,
    private indicadorService: IndicadoresService,
    private activatedRoute: ActivatedRoute, 
    private dialog: MatDialog) 
  { 
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
    this.llenar_datasource();
  }

  llenar_datasource() {
    this.idcriterio = history.state.criterio;
    this.idmodelo = history.state.modelo;

    this.indicadorService.listarIndicadorPorCriterioModelo(this.idcriterio.id_criterio, this.idmodelo.id_modelo).subscribe(data => {
      this.dataSource.data = data;
    });
  }

  abrirDialogo(valor: any, id: any, peso: any): void {
    const dialogRef = this.dialog.open(CalificacionComponent, {
      data: { valor, id, peso },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'success') {
        this.llenar_datasource();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Calificación registrada',
          showConfirmButton: true,
          timer: 1500
        })
      }
    });
  }

  regresar() {
    this.route.navigate(['/sup/modelo/detallemodelo'], { state: { modelo: this.idmodelo } });
  }
  irinicio() {

    // código del método del botón
    this.route.navigate(['/sup/modelo/modelo']);

  }
}