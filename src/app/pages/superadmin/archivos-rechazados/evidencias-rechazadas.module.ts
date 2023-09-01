import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadesEvidenciasrechazadasComponent } from './actividades-evidenciasrechazadas/actividades-evidenciasrechazadas.component';
import { EvidenciasRechazadasRoutingModule } from './evidencias-rechazadas-routing.module';
import { ArchivosRechazadosComponent } from './archivos/archivos.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ActividadesEvidenciasrechazadasComponent,
    ArchivosRechazadosComponent

  ],
  imports: [
    SharedModule,
    CommonModule,
    EvidenciasRechazadasRoutingModule
  ]
})
export class EvidenciasRechazadasModule { }
