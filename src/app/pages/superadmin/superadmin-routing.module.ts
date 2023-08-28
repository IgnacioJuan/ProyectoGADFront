import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { DashboardComponent2 } from './pages/dashboard/dashboard.component';
import { CrearUsuariosComponent } from './pages/crear-usuarios/crear-usuarios.component';
import { ObcervacionesComponent } from './pages/observaciones/obcervaciones.component';
import { RoleguardGuard } from 'src/app/services/Guards/roleguard.guard';
import { SubcriteriosComponent } from './pages/subcriterios/subcriterios.component';
import { IndicadorComponent } from './pages/indicador/indicador.component';
import { EvidenciasComponent } from './pages/evidencias/evidencias.component';
import { EvidenciaAtrasadaComponent } from './pages/evidencia-atrasada/evidencia-atrasada.component';
import { CriterioReporteComponent } from './pages/criterio-reporte/criterio-reporte.component';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';
import { ObjetivoodsListaComponent } from './pages/objetivoods-lista/objetivoods-lista.component';
import { DialogoUsuariosComponent } from './pages/dialogo-usuarios/dialogo-usuarios.component';
import { CrearComponent } from './pages/crear-programa/crear-programa.component';
import { AprobarPoaComponent } from './pages/aprobar-poa/aprobar-poa/aprobar-poa.component';
import { DetallePoaComponent } from './pages/poacc/detalle-poa/detalle-poa/detalle-poa.component';

const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent2,
  pathMatch: 'full',
  canActivate: [SuperGuard]
}
  ,
{
  path: 'usuarios',
  component: CrearUsuariosComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},
{
  path: 'crearUsu',
  component: DialogoUsuariosComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},

{

  path: 'observaciones',
  component: ObcervacionesComponent,
  pathMatch: 'full',
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }

}
  ,

{
  path: 'subcriterioSuper',
  component: SubcriteriosComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},
{
  path: 'indicadoreSuper',
  component: IndicadorComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},
{
  path: 'evidenciaSuper',
  component: EvidenciasComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},

{

  path: 'actividad-rechazada',
  component: EvidenciaAtrasadaComponent,
  pathMatch: 'full',
  //canActivate: [SuperGuard]
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }

}
  ,
{
  path: 'crearpro',
  component: CrearComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},
{
  path: 'aprobar-poa',
  component: AprobarPoaComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},

{
  path: 'detalle-poa',
  component: DetallePoaComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},

//Compartidas
{
  path: 'criterio_reporte',
  component: CriterioReporteComponent,
  pathMatch: 'full',
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN', 'ADMIN', 'AUTORIDAD'] }
},
{
  path: 'actividad_responsable',
  component: DashboardComponent,
  pathMatch: 'full',
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }
},
{
  path: 'objetivoods-lista',
  component: ObjetivoodsListaComponent,
  pathMatch: 'full',
  canActivate: [RoleguardGuard], // Asegúrate de que el guard sea el adecuado
  data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] } // Ajusta los roles permitidos
},
{
  path: 'modelo',
  loadChildren: () => import("./modelo/modelo.module").then(m => m.ModeloModule)
},
{
  path: 'ponderacion',
  loadChildren: () => import("./ponderacion/ponderacion.module").then(m => m.PonderacionModule)
},
{
  path: 'flujo-criterio',
  loadChildren: () => import("./flujo-criterio/flujo-criterio.module").then(m => m.FlujoCriterioModule)
},
{
  path: 'formula',
  loadChildren: () => import("./formula/formula.module").then(m => m.FormulaModule)
},
{
  path: 'flujo-modelo',
  loadChildren: () => import("./flujo-modelo/flujo-modelo.module").then(m => m.FlujoModeloModule)
},
{
  path: 'flujo_Componentes',
  loadChildren: () => import("./flujo-componentes/flujo-componentes.module").then(m => m.FlujoComponentesModule)
},
  {
    path: 'ejes',
    loadChildren: () => import("./ejes/ejes.module").then(m => m.EjesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule {

}
