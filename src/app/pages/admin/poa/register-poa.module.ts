import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterPoaRoutingModule } from './register-poa-routing.module';
import { RegistrarPoaComponent } from './registrar-poa/registrar-poa.component';
import { ListarProyectosComponent } from './listar-proyectos/listar-proyectos/listar-proyectos.component';
import { AddActiviesComponent } from './add-activies/add-activies.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RegistrarPoaComponent,
    ListarProyectosComponent,
    AddActiviesComponent,
  ],
  imports: [
    CommonModule,
    RegisterPoaRoutingModule,

    SharedModule
  ]
})
export class RegisterPoaModule {

}
