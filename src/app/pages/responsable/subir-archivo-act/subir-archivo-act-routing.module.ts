import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Actividades_desigComponent } from './actividades_desig/actividades_desig.component';
import { NormalGuard } from 'src/app/services/Guards/normal.guard';
import { Subir_archivo_acti_desigComponent } from './subir_archivo_acti_desig/subir_archivo_acti_desig.component';

const routes: Routes = [

  {
    path: 'actividadesdesig',
    component: Actividades_desigComponent,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  }
  ,
  {
    path: 'subir_archiivo',
    component: Subir_archivo_acti_desigComponent,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubirArchivoActRoutingModule { }
