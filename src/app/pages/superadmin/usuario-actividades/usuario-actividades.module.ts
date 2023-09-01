import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadesComponent } from './actividades/actividades.component';
import { VisualizarActividadesComponent } from './visualizar-actividades/visualizar-actividades.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsuarioActividadesRoutingModule } from './usuario-actividades-routing.module';



@NgModule({
  declarations: [
    ActividadesComponent,
    VisualizarActividadesComponent
  ],
  imports: [
    CommonModule,
    UsuarioActividadesRoutingModule,
    SharedModule
  ]
})
export class UsuarioActividadesModule { }
