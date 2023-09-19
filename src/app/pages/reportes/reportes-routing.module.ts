import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Repote_metasComponent } from './repote_metas/repote_metas.component';
import { RoleguardGuard } from 'src/app/services/Guards/roleguard.guard';
const routes: Routes = [
  {
    path: 'reporte_metas',
    component: Repote_metasComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard], // Asegúrate de que el guard sea el adecuado
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] } // Ajusta los roles permitidos
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
