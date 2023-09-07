import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AprobarActividadesRoutingModule } from './aprobar-actividades-routing.module';
import { ListPoaActividadComponent } from './list-poa-actividad/list-poa-actividad.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListPoaActividadComponent,
  ],
  imports: [
    CommonModule,
    AprobarActividadesRoutingModule,
    SharedModule
  ]
})
export class AprobarActividadesModule { }
