import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluarPoaRoutingModule } from './evaluar-poa-routing.module';
import { PoasComponent } from './poas/poas.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PoasComponent
  ],
  imports: [
    CommonModule,
    EvaluarPoaRoutingModule,
    SharedModule
  ]
})
export class EvaluarPoaModule { }
