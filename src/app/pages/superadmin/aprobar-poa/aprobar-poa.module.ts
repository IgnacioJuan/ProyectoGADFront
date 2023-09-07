import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AprobarPoaRoutingModule } from './aprobar-poa-routing.module'
import { DetallePoaComponent } from './detalle-poa/detalle-poa.component';
import { AprobarPoaComponent } from './aprobar-poa/aprobar-poa.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({

declarations: [ 
  AprobarPoaComponent,
  DetallePoaComponent
],
  imports: [
    CommonModule,
    AprobarPoaRoutingModule,
    SharedModule
  ]
})
export class AprobarPoaModule { }
