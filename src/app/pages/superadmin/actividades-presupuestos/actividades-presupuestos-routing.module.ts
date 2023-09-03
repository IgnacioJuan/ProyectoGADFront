import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { ListaActividadesComponent } from './actividades/actividades.component';
import { ListaPoaComponent } from './listaPoa/listapoa.component';

const routes: Routes = [
  {
    path: 'tabla-poas',
    component: ListaPoaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'tabla-actividades',
    component: ListaActividadesComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesPresupuestosRoutingModule { }
