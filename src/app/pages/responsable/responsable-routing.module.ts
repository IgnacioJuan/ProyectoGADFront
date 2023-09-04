import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvidenciasResponComponent } from './evidencias/evidencias.component';
import { NormalGuard } from 'src/app/services/Guards/normal.guard';

const routes: Routes = [
  {
    path: 'activ',  // Cuando se navega a '/respon'
    loadChildren: () => import("./subir-archivo-act/subir-archivo-act.module")
      .then(m => m.SubirArchivoActModule)  // Cargar el módulo SubirArchivoActModule
  },
  
  {
    path: 'evidenciaResponsable',
    component: EvidenciasResponComponent,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsableRoutingModule { }
