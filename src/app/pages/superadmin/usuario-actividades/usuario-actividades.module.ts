import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { VisualizarActividadesComponent } from './visualizar-actividades/visualizar-actividades.component';



@NgModule({
  declarations: [
    UsuariosComponent,
    ActividadesComponent,
    VisualizarActividadesComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UsuarioActividadesModule { }
