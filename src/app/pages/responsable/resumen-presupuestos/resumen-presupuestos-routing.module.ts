import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NormalGuard } from 'src/app/services/Guards/normal.guard';
import { ListaActividadesComponent } from './lista-actividades/lista-actividades.component';

const routes: Routes = [
  {
    path: 'lista-actividades',
    component: ListaActividadesComponent,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumenPresupuestosRoutingModule { }
