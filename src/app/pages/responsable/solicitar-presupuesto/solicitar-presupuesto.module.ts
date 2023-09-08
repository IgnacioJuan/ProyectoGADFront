import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitarPresupuestoRoutingModule } from './solicitar-presupuesto-routing.module';
import { ListSolicitudesComponent } from './list-solicitudes/list-solicitudes.component';
import { CrearSolicitudComponent } from './crear-solicitud/crear-solicitud.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListSolicitudesComponent,
    CrearSolicitudComponent,
  ],
  imports: [
    CommonModule,
    SolicitarPresupuestoRoutingModule,
    SharedModule
  ]
})
export class SolicitarPresupuestoModule { }
