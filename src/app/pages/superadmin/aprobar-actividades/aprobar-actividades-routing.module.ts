import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPoaActividadComponent } from './list-poa-actividad/list-poa-actividad.component';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { ListActivEvidenciaComponent } from './list-activ-evidencia/list-activ-evidencia.component';

const routes: Routes = [
  {
    path: 'poa-actividad',
    component: ListPoaActividadComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'listActividadAprobar',
    component: ListActivEvidenciaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobarActividadesRoutingModule { }
