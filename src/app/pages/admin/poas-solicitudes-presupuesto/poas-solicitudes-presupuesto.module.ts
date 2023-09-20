import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoasSolicitudesPresupuestoRoutingModule } from './poas-solicitudes-presupuesto-routing.module';
import { ListPoaSolicitudComponent } from './list-poa-solicitud/list-poa-solicitud.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListadoSolicitudesComponent } from './listado-solicitudes/listado-solicitudes.component';


@NgModule({
  declarations: [
    ListPoaSolicitudComponent,
    ListadoSolicitudesComponent
  ],
  imports: [
    CommonModule,
    PoasSolicitudesPresupuestoRoutingModule,
    SharedModule
  ]
})
export class PoasSolicitudesPresupuestoModule { }
