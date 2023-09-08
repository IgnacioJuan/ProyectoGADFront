import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSolicitudesComponent } from './list-solicitudes/list-solicitudes.component';
import { NormalGuard } from 'src/app/services/Guards/normal.guard';
import { CrearSolicitudComponent } from './crear-solicitud/crear-solicitud.component';

const routes: Routes = [
  
  {
    path: 'listSolicitudes',
    component: ListSolicitudesComponent,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  },
    
  {
    path: 'crearSolicitudes',
    component: CrearSolicitudComponent,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitarPresupuestoRoutingModule { }
