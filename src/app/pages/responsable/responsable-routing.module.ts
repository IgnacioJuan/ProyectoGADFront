import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActividadesResponsableComponent } from './actividades-responsable/actividades-responsable.component';
import { EvidenciasResponComponent } from './evidencias/evidencias.component';
import { EvidenciaTareasAsginadasComponent } from './evidencia-tareas-asginadas/evidencia-tareas-asginadas.component';
import { ActividadCriterioModelo } from './actividad-criterio-modelo/actividad-criterio-modelo.component';
import { ActividadCriterioDetalle } from './actividad-criterio-detalle/actividad-criterio-detalle.component';
import { ActividadCriterioSubcriterio } from './atividad-criterio-subcriterio/atividad-criterio-subcriterio.component';
import { ActiviadDetalleIndicadorComponent } from './actividad-detalle-indicador/actividad-detalle-indicador.component';
import { NormalGuard } from 'src/app/services/Guards/normal.guard';

const routes: Routes = [
  {
    path: 'ActividadesResponsable',
    component: ActividadesResponsableComponent,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  }
  ,
  {
    path: 'evidenciaResponsable',
    component: EvidenciasResponComponent,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  },

  {
    path: 'eviTareaAsina',
    component: EvidenciaTareasAsginadasComponent,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  },
  {
    path: 'actividadCriterio',
    component: ActividadCriterioModelo,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  },

  {
    path: 'detalleC',
    component: ActividadCriterioDetalle,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  },
  {
    path: 'criterio-subcriterio',
    component: ActividadCriterioSubcriterio,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  },
 {
    path: 'subcriterio-indicador',
    component: ActiviadDetalleIndicadorComponent,
    pathMatch: 'full',
    canActivate: [NormalGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsableRoutingModule { }
