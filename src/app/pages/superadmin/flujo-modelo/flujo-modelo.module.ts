import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlujoModeloRoutingModule } from './flujo-modelo-routing.module';
import { ModeloComponent } from './modelo/modelo.component';
import { ModeloProyectoComponent } from './modelo-proyecto/modelo-proyecto.component';
import { ProyectoPoaComponent } from './proyecto-poa/proyecto-poa.component';
import { PoaActividadComponent } from './poa-actividad/poa-actividad.component';
import { ActividadEvidenciaComponent } from './actividad-evidencia/actividad-evidencia.component';


@NgModule({
  declarations: [
    ModeloComponent,
    ModeloProyectoComponent,
    ProyectoPoaComponent,
    PoaActividadComponent,
    ActividadEvidenciaComponent
  ],
  imports: [
    CommonModule,
    FlujoModeloRoutingModule
  ]
})
export class FlujoModeloModule { }
