import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResumenPresupuestosRoutingModule } from './resumen-presupuestos-routing.module';
import { ListaActividadesComponent } from './lista-actividades/lista-actividades.component';
import { MovimientosPresupuestosComponent } from './movimientos-presupuestos/movimientos-presupuestos.component';


@NgModule({
  declarations: [
    ListaActividadesComponent,
    MovimientosPresupuestosComponent
  ],
  imports: [
    CommonModule,
    ResumenPresupuestosRoutingModule
  ]
})
export class ResumenPresupuestosModule { }
