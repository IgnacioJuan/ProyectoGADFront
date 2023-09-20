import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { ListaActividadesComponent } from './actividades/actividades.component';
import { ListaPoaComponent } from './listaPoa/listapoa.component';
import { AdminGuard } from 'src/app/services/Guards/admin.guard';

const routes: Routes = [
  {
    path: 'tabla-poas',
    component: ListaPoaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard || AdminGuard]
  },
  {
    path: 'tabla-actividades',
    component: ListaActividadesComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard || AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesPresupuestosRoutingModule { }
