import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AprobarEvidenciasRoutingModule } from './aprobar-evidencias-routing.module';
import { ListActivEvidenciaComponent } from './list-activ-evidencia/list-activ-evidencia.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListPoaActividadComponent } from './list-poa-actividad/list-poa-actividad.component';
import { ListActArchivoComponent } from './list-act-archivo/list-act-archivo.component';


@NgModule({
  declarations: [
    ListActivEvidenciaComponent,
    ListPoaActividadComponent,
    ListActArchivoComponent
  ],
  imports: [
    CommonModule,
    AprobarEvidenciasRoutingModule,
    SharedModule
  ]
})
export class AprobarEvidenciasModule { }
