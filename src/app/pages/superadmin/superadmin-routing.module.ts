import { FlujoCriterioModule } from './flujo-criterio/flujo-criterio.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { CrearUsuariosComponent } from './pages/crear-usuarios/crear-usuarios.component';
import { RoleguardGuard } from 'src/app/services/Guards/roleguard.guard';
import { ObjetivoodsListaComponent } from './pages/objetivoods-lista/objetivoods-lista.component';
import { DialogoUsuariosComponent } from './pages/dialogo-usuarios/dialogo-usuarios.component';
import { CrearComponent } from './pages/crear-programa/crear-programa.component';
import { ReporteavancepoaComponent } from './reporteavancepoa/reporteavancepoa.component';
import { CrearcompetenciaComponent } from './pages/crear-competencia/crear-competencia.component';
//import { EvidenciasRechazoComponent } from './evidencias/evidencias.component';
import {
  ResumenEvidenciasResponsableModule
} from "./resumen-evidencias-responsable/resumen-evidencias-responsable.module";
import { ReporteEspecificoPoaComponent } from './reporte-especifico-poa/reporte-especifico-poa.component';
import { ListSolicitudesPresupuestoSuperadminComponent } from './pages/list-solicitudes-presupuesto-superadmin/list-solicitudes-presupuesto-superadmin.component';
import { ProyectosComponent } from './flujo-criterio/listaproyecto/listaproyecto.component';
import {ReportePresupuestoModule} from "./reporte-presupuesto/reporte-presupuesto.module";



const routes: Routes = [
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
  path: 'crearpro',
  component: CrearComponent,
  pathMatch: 'full',
  //canActivate: [SuperGuard]
  canActivate: [RoleguardGuard],
  data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }

}
  ,
//Compartidas

{
  path: 'reportePoa',
  component: ReporteavancepoaComponent,
  pathMatch: 'full',
 canActivate: [SuperGuard]
},
{
  path: 'reporteEspecificoPoa',
  component: ReporteEspecificoPoaComponent,
  pathMatch: 'full',
 canActivate: [SuperGuard]
},
{ path: 'reporteEspecificoPoa/:id',
component: ReporteEspecificoPoaComponent ,
pathMatch: 'full',
 canActivate: [SuperGuard]
},

{ path: 'listadoSolicitudes',
component: ListSolicitudesPresupuestoSuperadminComponent ,
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
  path: 'flujo-criterio',
  loadChildren: () => import("./flujo-criterio/flujo-criterio.module").then(m => m.FlujoCriterioModule)
},

{
  path: 'flujo_Componentes',
  loadChildren: () => import("./flujo-componentes/flujo-componentes.module").then(m => m.FlujoComponentesModule)
},

  {
    path: 'aprobarEvidencias',
    loadChildren: () => import("./aprobar-evidencias/aprobar-evidencias.module").then(m => m.AprobarEvidenciasModule)
  },

  {
    path: 'aprobar-actividades',
    loadChildren: () => import("./aprobar-actividades/aprobar-actividades.module").then(m => m.AprobarActividadesModule)
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
  },
  {
    path: 'archivos-rechazados',
    loadChildren: () => import("./archivos-rechazados/evidencias-rechazadas.module").then(m => m.EvidenciasRechazadasModule)

  },
{
  path: 'ejes',
  loadChildren: () => import("./ejes/ejes.module").then(m => m.EjesModule)
},

  {
    path: 'reporte-presupuesto',
    loadChildren: () => import("./reporte-presupuesto/reporte-presupuesto.module").then(m => m.ReportePresupuestoModule)
  },

{
  path: 'resumen-evidencias-responsable',
  loadChildren: () => import("./resumen-evidencias-responsable/resumen-evidencias-responsable.module").then(m => m.ResumenEvidenciasResponsableModule)
},
{
  path: 'usuario-actividades',
  loadChildren: () => import("./usuario-actividades/usuario-actividades.module").then(m => m.UsuarioActividadesModule)
},


{
  path: 'crearcompe',
  component: CrearcompetenciaComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},
{
  path: 'aprobacion-poa',
  loadChildren: () => import("./aprobar-poa/aprobar-poa.module").then(m => m.AprobarPoaModule)
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule {

}
