import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoaActividadComponent } from './poa-actividad/poa-actividad.component';
import { AdminGuard } from 'src/app/services/Guards/admin.guard';
import { ActividadesComponent } from './actividades/actividades.component';

const routes: Routes = [
  {
    path: 'poa-actividad',
    component: PoaActividadComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
  {
    path: 'actividades',
    component: ActividadesComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionActividadesRoutingModule { }
