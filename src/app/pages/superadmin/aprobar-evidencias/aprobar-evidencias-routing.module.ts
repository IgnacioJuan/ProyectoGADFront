import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListActivEvidenciaComponent } from './list-activ-evidencia/list-activ-evidencia.component';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { ListPoaActividadComponent } from './list-poa-actividad/list-poa-actividad.component';
import { ListActArchivoComponent } from './list-act-archivo/list-act-archivo.component';

const routes: Routes = [
  //Actividad
  {
    path: 'listActividadAprobar',
    component: ListActivEvidenciaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  //POA
  {
    path: 'listPoaAprobarEvidenciaSuper',
    component: ListPoaActividadComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  //ARCHIVO
  {
    path: 'listPoaAprobarArchivoSuper',
    component: ListActArchivoComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobarEvidenciasRoutingModule { }
