import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListActivEvidenciaComponent } from './list-activ-evidencia/list-activ-evidencia.component';
import { ListPoaActividadComponent } from './list-poa-actividad/list-poa-actividad.component';
import { ListActArchivoComponent } from './list-act-archivo/list-act-archivo.component';
import { AdminGuard } from 'src/app/services/Guards/admin.guard';

const routes: Routes = [
  //Actividad
  {
    path: 'listActividadAprobar',
    component: ListActivEvidenciaComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
  //POA
  {
    path: 'listPoaAprobarEvidenciaSuper',
    component: ListPoaActividadComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
  //ARCHIVO
  {
    path: 'listPoaAprobarArchivoSuper',
    component: ListActArchivoComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobarEvidenciasRoutingModule { }
