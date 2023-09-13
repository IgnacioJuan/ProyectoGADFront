import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AprobarActividadesRoutingModule } from './aprobar-actividades-routing.module';
import { ListPoaActividadComponent } from './list-poa-actividad/list-poa-actividad.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListActivEvidenciaComponent } from './list-activ-evidencia/list-activ-evidencia.component';


@NgModule({
  declarations: [
    ListPoaActividadComponent,
    ListActivEvidenciaComponent
  ],
  imports: [
    CommonModule,
    AprobarActividadesRoutingModule,
    SharedModule
  ]
})
export class AprobarActividadesModule { }
