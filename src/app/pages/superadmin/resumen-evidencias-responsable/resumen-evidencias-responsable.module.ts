import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResumenEvidenciasResponsableRoutingModule } from './resumen-evidencias-responsable-routing.module';
import {SharedModule} from "../../../shared/shared.module";
import { EvidenciasComponent } from './evidencias/evidencias.component';


@NgModule({
  declarations: [
    EvidenciasComponent,
  ],
  imports: [
    CommonModule,
    ResumenEvidenciasResponsableRoutingModule,
    SharedModule,
  ]
})
export class ResumenEvidenciasResponsableModule { }
