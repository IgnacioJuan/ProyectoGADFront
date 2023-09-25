import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlujoModeloRoutingModule } from './flujo-modelo-routing.module';
import { ModeloComponent } from './modelo/modelo.component';
import { ModeloProyectoComponent } from './modelo-proyecto/modelo-proyecto.component';
import { ProyectoPoaComponent } from './proyecto-poa/proyecto-poa.component';
import { PoaActividadComponent } from './poa-actividad/poa-actividad.component';
import { ActividadEvidenciaComponent } from './actividad-evidencia/actividad-evidencia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [
    ModeloComponent,
    ModeloProyectoComponent,
    ProyectoPoaComponent,
    PoaActividadComponent,
    ActividadEvidenciaComponent,
  ],
  imports: [
    CommonModule,
    FlujoModeloRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,

  ]
})
export class FlujoModeloModule { }
