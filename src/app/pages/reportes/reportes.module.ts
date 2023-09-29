import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { Repote_metasComponent } from './repote_metas/repote_metas.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReporteEspecificoCompetenciaComponent } from './reporte-especifico-competencia/reporte-especifico-competencia.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [Repote_metasComponent,
    ReporteEspecificoCompetenciaComponent],
  imports: [
    CommonModule,
    ReportesRoutingModule,     
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    SharedModule,
    NgChartsModule
  ]
})
export class ReportesModule { }
