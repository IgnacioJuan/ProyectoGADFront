import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SuperGuard} from "../../../services/Guards/super.guard";
import {EvidenciasComponent} from "./evidencias/evidencias.component";

const routes: Routes = [
  {
    path: 'evidencias',
    component: EvidenciasComponent,
    pathMatch: 'full',
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN', 'RESPONSABLE'] } // Ajusta los roles permitidos
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumenEvidenciasResponsableRoutingModule { }
