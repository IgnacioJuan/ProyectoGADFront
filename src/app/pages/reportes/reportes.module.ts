import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { Repote_metasComponent } from './repote_metas/repote_metas.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [Repote_metasComponent],
  imports: [
    CommonModule,
    ReportesRoutingModule,     
    MatTableModule,
    MatInputModule,
  ]
})
export class ReportesModule { }
