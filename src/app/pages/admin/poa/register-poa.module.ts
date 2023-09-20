import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { AddActiviesComponent } from './add-activies/add-activies.component';
import { CurrencyInputDirective } from './currency-input.directive';
import { ListarProyectosComponent } from './listar-proyectos/listar-proyectos/listar-proyectos.component';
import { RegisterPoaRoutingModule } from './register-poa-routing.module';
import { RegistrarPoaComponent } from './registrar-poa/registrar-poa.component';


@NgModule({
  declarations: [
    RegistrarPoaComponent,
    ListarProyectosComponent,
    AddActiviesComponent,
    CurrencyInputDirective
  ],
  imports: [
    CommonModule,
    RegisterPoaRoutingModule,
    SharedModule
  ]
})
export class RegisterPoaModule {

}
