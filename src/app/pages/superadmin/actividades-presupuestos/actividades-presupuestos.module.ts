import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActividadesPresupuestosRoutingModule } from './actividades-presupuestos-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListaActividadesComponent } from './actividades/actividades.component';
import { ListaPoaComponent } from './listaPoa/listapoa.component';


@NgModule({
  declarations: [
    ListaPoaComponent,
    ListaActividadesComponent
  ],
  imports: [
    CommonModule,
    ActividadesPresupuestosRoutingModule,
    SharedModule
  ]
})
export class ActividadesPresupuestosModule { }
