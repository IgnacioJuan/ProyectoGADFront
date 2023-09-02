
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AsignacionEvidenciaComponent } from './asignacion-evidencia/asignacion-evidencia.component';
import { AprobarRechazarAdminComponent } from './aprobar-rechazar-admin/aprobar-rechazar-admin.component';
import { AprobarRechazarDetalleAdminComponent } from './aprobar-rechazar-detalle-admin/aprobar-rechazar-detalle-admin.component';


import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [

    AsignacionEvidenciaComponent,
    AprobarRechazarAdminComponent,
    AprobarRechazarDetalleAdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,

    SharedModule
  ]
})
export class AdminModule { }
