import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPoaActividadComponent } from './list-poa-actividad/list-poa-actividad.component';
import { SuperGuard } from 'src/app/services/Guards/super.guard';

const routes: Routes = [
  {
    path: 'poa-actividad',
    component: ListPoaActividadComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobarActividadesRoutingModule { }
