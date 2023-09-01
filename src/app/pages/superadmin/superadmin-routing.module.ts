import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { CrearUsuariosComponent } from './pages/crear-usuarios/crear-usuarios.component';
import { RoleguardGuard } from 'src/app/services/Guards/roleguard.guard';
import { ObjetivoodsListaComponent } from './pages/objetivoods-lista/objetivoods-lista.component';
import { DialogoUsuariosComponent } from './pages/dialogo-usuarios/dialogo-usuarios.component';
import { CrearComponent } from './pages/crear-programa/crear-programa.component';
import { AprobarPoaComponent } from './pages/aprobar-poa/aprobar-poa/aprobar-poa.component';
import { DetallePoaComponent } from './pages/poacc/detalle-poa/detalle-poa/detalle-poa.component';
import { ReporteavancepoaComponent } from './reporteavancepoa/reporteavancepoa.component';
import { CrearcompetenciaComponent } from './pages/crear-competencia/crear-competencia.component';
import {
  ResumenEvidenciasResponsableModule
} from "./resumen-evidencias-responsable/resumen-evidencias-responsable.module";
import { ArchivosRechazadosComponent } from './archivos/archivos.component';

const routes: Routes = [
{
  path: 'usuarios',
  component: CrearUsuariosComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},

{
  path: 'evidenciarechazo',
  component: ArchivosRechazadosComponent,
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
  path: 'reportePoa',
  component: ReporteavancepoaComponent,
  pathMatch: 'full',
 canActivate: [SuperGuard]
},
{
  path: 'objetivoods-lista',
  component: ObjetivoodsListaComponent,
  pathMatch: 'full',
  canActivate: [RoleguardGuard], // Asegúrate de que el guard sea el adecuado
  data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] } // Ajusta los roles permitidos
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
  {
    path: 'aprobarEvidencias',
    loadChildren: () => import("./aprobar-evidencias/aprobar-evidencias.module").then(m => m.AprobarEvidenciasModule)
  },
  {
    path: 'resumen-evidencias-responsable',
    loadChildren: () => import("./resumen-evidencias-responsable/resumen-evidencias-responsable.module").then(m => m.ResumenEvidenciasResponsableModule)
  },

  {
    path: 'crearcompe',
    component: CrearcompetenciaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'actividades-presupuestos',
    loadChildren: () => import("./actividades-presupuestos/actividades-presupuestos.module").then(m => m.ActividadesPresupuestosModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule {

}
