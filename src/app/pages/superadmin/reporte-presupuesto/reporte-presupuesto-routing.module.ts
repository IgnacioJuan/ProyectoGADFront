import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SuperGuard} from "../../../services/Guards/super.guard";
import {ReporteProyectoComponent} from "./reporte-proyecto/reporte-proyecto.component";

const routes: Routes = [{
  path: 'reporteproyecto',
  component: ReporteProyectoComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportePresupuestoRoutingModule { }
