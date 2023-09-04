import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsignacionActividadesRoutingModule } from './asignacion-actividades-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PoaActividadComponent } from './poa-actividad/poa-actividad.component';
import { ActividadesComponent } from './actividades/actividades.component';


@NgModule({
  declarations: [
    PoaActividadComponent,
    ActividadesComponent

  ],
  imports: [
    CommonModule,
    AsignacionActividadesRoutingModule,
    SharedModule
  ]
})
export class AsignacionActividadesModule { }
