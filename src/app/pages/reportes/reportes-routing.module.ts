import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Repote_metasComponent } from './repote_metas/repote_metas.component';
import { RoleguardGuard } from 'src/app/services/Guards/roleguard.guard';
import { ReporteEspecificoCompetenciaComponent } from './reporte-especifico-competencia/reporte-especifico-competencia.component';
import { ReporteCProyectoComponent } from './reporte-c-proyecto/reporte-c-proyecto.component';
import { ReporteCActividadesComponent } from './reporte-c-actividades/reporte-c-actividades.component';
import { ReporteProgramasComponent } from './reporte-programas/reporte-programas.component';
import { ReportePgProyectoComponent } from './reporte-pg-proyecto/reporte-pg-proyecto.component';
const routes: Routes = [
  {
    path: 'reporte_metas',
    component: Repote_metasComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard], // Asegúrate de que el guard sea el adecuado
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }, // Ajusta los roles permitidos
  },
  {
    path: 'reporteECompetencia',
    component: ReporteEspecificoCompetenciaComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] },
  }, 
  {
    path: 'reporteECompetencia/reporteEProyecto/:id_competencia',
    component: ReporteCProyectoComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] },
  },
  {
    path: 'reporteECompetencia/reporteEProyecto/reporteEActividad/:id_proyecto',
    component: ReporteCActividadesComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] },
  },
  {
    path: 'reporteProgramas',
    component: ReporteProgramasComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] },
  },
  {
    path: 'reporteProgramas/reportePProyecto/:id_programa',
    component: ReportePgProyectoComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] },
  },
  {
    path: 'reporteProgramas/reportePProyecto/reportePActividad/:id_proyecto',
    component: ReporteCActividadesComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule { }
