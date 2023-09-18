import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresupuestoEjecutadoRoutingModule } from './presupuesto-ejecutado-routing.module';
import { ListaPoaComponent } from './listaPoa/listapoa.component';
import { ListaActividadesComponent } from './actividades/actividades.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListaPoaComponent,
    ListaActividadesComponent
  ],
  imports: [
    CommonModule,
    PresupuestoEjecutadoRoutingModule,
    SharedModule
  ]
})
export class PresupuestoEjecutadoModule { }
