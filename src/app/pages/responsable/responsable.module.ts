
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsableRoutingModule } from './responsable-routing.module';
import { EvidenciasResponComponent } from './evidencias/evidencias.component';


import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    EvidenciasResponComponent,
  ],
  imports: [
    CommonModule,
    ResponsableRoutingModule,
    
    SharedModule
  ]
})
export class ResponsableModule { }
