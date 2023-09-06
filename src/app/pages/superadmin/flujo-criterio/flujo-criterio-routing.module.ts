import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { CrearcompetenciaComponent } from '../pages/crear-competencia/crear-competencia.component';
import { CrearComponent } from '../pages/crear-programa/crear-programa.component';
import { ListarpoaComponent } from './listarpoa/listarpoa.component';
import { ListarporUsuarioComponent } from './listarpoaporusuario/listarpoaporusuario.component';



const routes: Routes = [
  {
    path: 'crearpro',
    component: CrearComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'listarpoa',
    component: ListarpoaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'listarpoausu',
    component: ListarporUsuarioComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'crearcompe',
    component: CrearcompetenciaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoCriterioRoutingModule { }
