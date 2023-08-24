import { Component, OnInit, ViewChild } from '@angular/core';
import { ModeloService } from 'src/app/services/modelo.service';
import { Router } from '@angular/router';
import { Modelo } from 'src/app/models/Modelo';
import { CriteriosService } from 'src/app/services/criterios.service';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ActivatedRoute } from '@angular/router';
import { AsignacionIndicadorService } from 'src/app/services/asignacion-indicador.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


type ColumnNames = {
  [key: string]: string;
}

@Component({
  selector: 'app-detalle-modelo',
  templateUrl: './actividad-criterio-detalle.component.html',
  styleUrls: ['./actividad-criterio-detalle.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ActividadCriterioDetalle implements OnInit {

  public columnNames: ColumnNames = {
    nombre: 'Nombre del Criterio',
    descripcion: 'Descripción del Criterio'
  };

  dataSource: any;
  asignacion: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnsToDisplay = ['nombre', 'descripcion'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay];
  expandedElement: any;

  model: Modelo = new Modelo();

  constructor(
    private route: ActivatedRoute,
    public modeloService: ModeloService,
    public criterioService: CriteriosService,
    public subcriterioService: SubcriteriosService,
    public indicadorService: IndicadoresService,
    private asignacionIndicadorService: AsignacionIndicadorService,
    private sharedDataService: SharedDataService,
    private router: Router) { }

  ngOnInit(): void {
    this.recibeModelo();
    this.dataSource.paginator = this.paginator;


  }
  id = localStorage.getItem("id");
  recibeModelo() {
    this.modeloService.getModeloById(Number(this.id)).subscribe(data => {
      this.model = data;
      this.asignacionIndicadorService.getAsignacionIndicadorByIdModelo(Number(this.id)).subscribe(info => {
        this.criterioService.getCriterios().subscribe(result => {
          this.asignacion = info;
          this.dataSource = result.filter((criterio: any) => {
            return info.some((asignacion: any) => {
              return criterio.id_criterio === asignacion.indicador.subcriterio.criterio.id_criterio;
            });
          });
          this.dataSource.paginator = this.paginator; // Moved here
        });
      });
    });
  }



  irPonderacionModelo(modelo: Modelo): void {

    //llevar modelo

    localStorage.setItem("id", modelo.id_modelo.toString());
    console.log(modelo.id_modelo)
    this.model = modelo;
    this.router.navigate(['/sup/ponderacion/ponderacion-modelo']);


  }
  ponderacionCriterio(event: Event, element: any) {
    event.stopPropagation();
    // código del método del botón
    this.router.navigate(['/sup/ponderacion/ponderacion-criterio'], { queryParams: { criterio: element.id_criterio, modelo: this.id } });
  }

  mostrar(element: any) {
    console.log(element);
    this.sharedDataService.agregarIdCriterio(element.id_criterio);
    this.router.navigate(['/res/criterio-subcriterio']);
  }

  evaluacion(event: Event, element: any) {
    event.stopPropagation();
    // código del método del botón
    this.router.navigate(['/sup/modelo/matriz-evaluacion'], { queryParams: { criterio: element.id_criterio, modelo: this.id } });
  }

  ponderacion(event: Event, element: any) {
    event.stopPropagation();
    // código del método del botón
    this.sharedDataService.agregarIdCriterio(element.id_criterio);
  }
}