import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EjesRoutingModule } from './ejes-routing.module';
import { EjesListaComponent } from './ejes-lista/ejes-lista.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ObjetivopndComponent } from './objetivopnd/objetivopnd.component';


@NgModule({
  declarations: [
    EjesListaComponent,
    ObjetivopndComponent,
  ],
  imports: [
    CommonModule,
    EjesRoutingModule,
    SharedModule,
  ]
})
export class EjesModule { }
