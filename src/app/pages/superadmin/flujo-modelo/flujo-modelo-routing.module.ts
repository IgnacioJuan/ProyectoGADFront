import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModeloComponent } from './modelo/modelo.component';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { ModeloProyectoComponent } from './modelo-proyecto/modelo-proyecto.component';
import { ProyectoPoaComponent } from './proyecto-poa/proyecto-poa.component';
import { PoaActividadComponent } from './poa-actividad/poa-actividad.component';
import { ActividadEvidenciaComponent } from './actividad-evidencia/actividad-evidencia.component';

const routes: Routes = [
  {
    path: 'modelo',
    component: ModeloComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'modelo-proyecto',
    component: ModeloProyectoComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'proyecto-poa',
    component: ProyectoPoaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'poa-actividad',
    component: PoaActividadComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'actividad-evidencia',
    component: ActividadEvidenciaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoModeloRoutingModule { 
  
}
