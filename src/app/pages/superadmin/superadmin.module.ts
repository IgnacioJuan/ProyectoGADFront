
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperadminRoutingModule } from './superadmin-routing.module';

import { DashboardComponent2 } from './pages/dashboard/dashboard.component';
import { CrearUsuariosComponent } from './pages/crear-usuarios/crear-usuarios.component';
import { SubcriteriosComponent } from './pages/subcriterios/subcriterios.component';
import { IndicadorComponent } from './pages/indicador/indicador.component';
import { EvidenciasComponent } from './pages/evidencias/evidencias.component';
import { ObcervacionesComponent } from './pages/observaciones/obcervaciones.component';
import { CriterioReporteComponent } from './pages/criterio-reporte/criterio-reporte.component';
import { EvidenciaAtrasadaComponent } from './pages/evidencia-atrasada/evidencia-atrasada.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { ObjetivoodsListaComponent } from './pages/objetivoods-lista/objetivoods-lista.component';
import { DialogoUsuariosComponent } from './pages/dialogo-usuarios/dialogo-usuarios.component';
import { CrearComponent } from './pages/crear-programa/crear-programa.component';
import { AprobarPoaComponent } from './pages/aprobar-poa/aprobar-poa/aprobar-poa.component';
import { DetallePoaComponent } from './pages/poacc/detalle-poa/detalle-poa/detalle-poa.component';
import { CustomDatePipe, ReporteavancepoaComponent } from './reporteavancepoa/reporteavancepoa.component';
import { ReporteEspecificoPoaComponent } from './reporte-especifico-poa/reporte-especifico-poa.component';
import { CrearcompetenciaComponent } from './pages/crear-competencia/crear-competencia.component';
import { EvidenciasRechazoComponent } from './evidencias/evidencias.component';


@NgModule({
  declarations: [
    DashboardComponent2,
    CrearUsuariosComponent,
    SubcriteriosComponent,
    IndicadorComponent,
    EvidenciasComponent,
    ObcervacionesComponent,
    SubcriteriosComponent,
    CriterioReporteComponent,
    EvidenciaAtrasadaComponent,
    ObjetivoodsListaComponent,
    DialogoUsuariosComponent,
    CrearComponent,
    AprobarPoaComponent,
    DetallePoaComponent,
    ReporteavancepoaComponent,
    ReporteEspecificoPoaComponent,
    CrearcompetenciaComponent,
    EvidenciasRechazoComponent,
    CustomDatePipe,

  ],
  imports: [
    CommonModule,
    SuperadminRoutingModule,
    SharedModule,

  ]
})
export class SuperadminModule { }
