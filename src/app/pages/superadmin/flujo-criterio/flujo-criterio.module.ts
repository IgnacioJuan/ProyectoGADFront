import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlujoCriterioRoutingModule } from './flujo-criterio-routing.module';
import { CriteriosComponent } from './criterios/criterios.component';
import { IndicadoresEvidenciaComponent } from './indicadores-evidencia/indicadores-evidencia.component';
import { CriteriosSubcriterioComponent } from './criterios-subcriterio/criterios-subcriterio.component';
import { SubcriteriosIndicadorComponent } from './subcriterios-indicador/subcriterios-indicador.component';
import { EvaluacionCuantitativaComponent } from './evaluacion-cuantitativa/evaluacion-cuantitativa.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrearComponent } from './crear-programa/crear-programa.component';
import { CrearcompetenciaComponent } from './crear-competencia/crear-competencia.component';


@NgModule({
  declarations: [
    CriteriosComponent,
    CrearComponent,
    IndicadoresEvidenciaComponent,
    CriteriosSubcriterioComponent,
    SubcriteriosIndicadorComponent,
    EvaluacionCuantitativaComponent,
    CrearComponent,
    CrearcompetenciaComponent
    
    

  ],
  imports: [
    CommonModule,
    FlujoCriterioRoutingModule,
    SharedModule
  ]
})
export class FlujoCriterioModule { }
