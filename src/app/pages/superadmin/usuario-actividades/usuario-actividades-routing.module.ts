import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { ActividadesComponent } from './actividades/actividades.component';
import { VisualizarActividadesComponent } from './visualizar-actividades/visualizar-actividades.component';
const routes: Routes = [

  {
    path: 'listar-actividades',
    component: ActividadesComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  
  {
    path: 'visualizar',
    component: VisualizarActividadesComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioActividadesRoutingModule { }
