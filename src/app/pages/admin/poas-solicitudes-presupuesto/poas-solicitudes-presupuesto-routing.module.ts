import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPoaSolicitudComponent } from './list-poa-solicitud/list-poa-solicitud.component';
import { AdminGuard } from 'src/app/services/Guards/admin.guard';
import { ListadoSolicitudesComponent } from './listado-solicitudes/listado-solicitudes.component';

const routes: Routes = [
  {
    path: 'listarPoasSoli',
    component: ListPoaSolicitudComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
  {
    path: 'listaSolicitudes',
    component: ListadoSolicitudesComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoasSolicitudesPresupuestoRoutingModule { }
