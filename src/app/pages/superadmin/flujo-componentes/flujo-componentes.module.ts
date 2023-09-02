import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlujoComponentesRoutingModule } from './flujo-componentes-routing.module';
import { ComponentesComponent } from './componentes/componentes.component';
import { ComponenteObjetivoPdotComponent } from './componente-objetivo-pdot/componente-objetivo-pdot.component';
import { MetasPdotIndicadoresComponent } from './metas-pdot-indicadores/metas-pdot-indicadores.component';
import { ObjetivoPdotMetasPdotComponent } from './objetivo-pdot-metas-pdot/objetivo-pdot-metas-pdot.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ComponentesComponent,
    ComponenteObjetivoPdotComponent,
    MetasPdotIndicadoresComponent,
    ObjetivoPdotMetasPdotComponent
  ],
  imports: [
    CommonModule,
    FlujoComponentesRoutingModule,
    SharedModule
  ]
})
export class FlujoComponentesModule { }
