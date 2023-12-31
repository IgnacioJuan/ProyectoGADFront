
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AsignacionEvidenciaComponent } from './asignacion-evidencia/asignacion-evidencia.component';
import { AprobarRechazarAdminComponent } from './aprobar-rechazar-admin/aprobar-rechazar-admin.component';
import { AprobarRechazarDetalleAdminComponent } from './aprobar-rechazar-detalle-admin/aprobar-rechazar-detalle-admin.component';


import { SharedModule } from 'src/app/shared/shared.module';
import { ListPoasEnviadosAdminComponent } from './list-poas-enviados-admin/list-poas-enviados-admin.component';
import { CrearResponsablesComponent } from './crear-responsables/crear-responsables.component';
import { DialogoUresponsablesComponent } from './dialogo-uresponsables/dialogo-uresponsables.component';

@NgModule({
  declarations: [

    AsignacionEvidenciaComponent,
    AprobarRechazarAdminComponent,
    AprobarRechazarDetalleAdminComponent,
    ListPoasEnviadosAdminComponent,
    CrearResponsablesComponent,
    DialogoUresponsablesComponent,




  ],
  imports: [
    CommonModule,
    AdminRoutingModule,

    SharedModule
  ]
})
export class AdminModule { }
