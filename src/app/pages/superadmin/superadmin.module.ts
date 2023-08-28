
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
import { AprobarPoaComponent } from './pages/aprobar-poa/aprobar-poa/aprobar-poa.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DetallePoaComponent } from './pages/poacc/detalle-poa/detalle-poa/detalle-poa.component';

import { FormsModule  } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    AprobarPoaComponent,
    DetallePoaComponent,

  ],
  imports: [
    CommonModule,
    SuperadminRoutingModule,

    SharedModule,
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    NgIf
  ]
})
export class SuperadminModule { }
