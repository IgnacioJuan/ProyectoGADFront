import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportePresupuestoRoutingModule } from './reporte-presupuesto-routing.module';
import { ReporteProyectoComponent } from './reporte-proyecto/reporte-proyecto.component';
import {SharedModule} from "../../../shared/shared.module";


@NgModule({
  declarations: [
    ReporteProyectoComponent
  ],
  imports: [
    CommonModule,
    ReportePresupuestoRoutingModule,
    SharedModule,
  ]
})
export class ReportePresupuestoModule { }
