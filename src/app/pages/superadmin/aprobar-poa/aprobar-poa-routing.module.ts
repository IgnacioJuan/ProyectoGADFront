import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AprobarPoaComponent } from './aprobar-poa/aprobar-poa.component';
import { DetallePoaComponent } from './detalle-poa/detalle-poa.component';
import { SuperGuard } from 'src/app/services/Guards/super.guard';

const routes: Routes = [
  {
    path: 'lista-aprobar-poa',
    component: AprobarPoaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  
  {
    path: 'detalle-poa/:id_poa',
    component: DetallePoaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobarPoaRoutingModule { }
