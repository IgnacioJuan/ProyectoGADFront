import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportePoaRoutingModule } from './reporte-poa-routing.module';
import { CustomDatePipe, ReporteavancepoaComponent } from './reporteavancepoa/reporteavancepoa.component';
import { ReporteEspecificoPoaComponent } from './reporte-especifico-poa/reporte-especifico-poa.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ReporteavancepoaComponent,
    ReporteEspecificoPoaComponent,
    CustomDatePipe,
  ],
  imports: [
    CommonModule,
    ReportePoaRoutingModule,
    SharedModule
  ]
})
export class ReportePoaModule { }
