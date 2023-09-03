import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/services/Guards/admin.guard';

import { AprobarRechazarAdminComponent } from './aprobar-rechazar-admin/aprobar-rechazar-admin.component';
import { RoleguardGuard } from 'src/app/services/Guards/roleguard.guard';
import { AsignacionEvidenciaComponent } from './asignacion-evidencia/asignacion-evidencia.component';
import { AprobarRechazarDetalleAdminComponent } from './aprobar-rechazar-detalle-admin/aprobar-rechazar-detalle-admin.component';
import { PoaActividadComponent } from './asignacion-actividades/poa-actividad/poa-actividad.component';

const routes: Routes = [
  
  {
    path: 'apruebaAdmin',
    component: AprobarRechazarAdminComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }

  },
  {
    path: 'asignaEvidencia',
    component: AsignacionEvidenciaComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]

  },
  {
    path: 'detalleAprobarRechazar',
    component: AprobarRechazarDetalleAdminComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }

  },
  {
    path: 'poa',
    loadChildren: () => import("./poa/register-poa.module").then(m => m.RegisterPoaModule)
  },{
    path: 'asignacion-actividades',
    loadChildren: () => import("./asignacion-actividades/asignacion-actividades.module").then(m => m.AsignacionActividadesModule)
    
  },
  {
    path: 'poa',
    loadChildren: () => import("./poa/register-poa.module").then(m => m.RegisterPoaModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
