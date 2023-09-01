
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
import { ListarpoaComponent } from './flujo-criterio/listarpoa/listarpoa.component';
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
    ListarpoaComponent  

  ],
  imports: [
    CommonModule,
    SuperadminRoutingModule,

    SharedModule,
  ]
})
export class SuperadminModule { }
