
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AsignacionEvidenciaComponent } from './asignacion-evidencia/asignacion-evidencia.component';
import { AprobarRechazarAdminComponent } from './aprobar-rechazar-admin/aprobar-rechazar-admin.component';
import { AprobarRechazarDetalleAdminComponent } from './aprobar-rechazar-detalle-admin/aprobar-rechazar-detalle-admin.component';


import { SharedModule } from 'src/app/shared/shared.module';
import { RegistrarPoaComponent } from './poa/registrar-poa/registrar-poa.component';
import { ListarProyectosComponent } from './poa/listar-proyectos/listar-proyectos/listar-proyectos.component';
import { AddActiviesComponent } from './poa/add-activies/add-activies.component';

@NgModule({
  declarations: [

    AsignacionEvidenciaComponent,
    AprobarRechazarAdminComponent,
    AprobarRechazarDetalleAdminComponent,
    RegistrarPoaComponent,
    ListarProyectosComponent,
    AddActiviesComponent,


  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
   
    SharedModule
  ]
})
export class AdminModule { }
