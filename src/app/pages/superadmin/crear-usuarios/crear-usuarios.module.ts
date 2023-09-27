import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrearUsuariosRoutingModule } from './crear-usuarios-routing.module';
import { DialogoUsuariosComponent } from './dialogo-usuarios/dialogo-usuarios.component';
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CrearUsuariosComponent,
    DialogoUsuariosComponent,
  ],
  imports: [
    CommonModule,
    CrearUsuariosRoutingModule,
    SharedModule
  ]
})
export class CrearUsuariosModule { }
