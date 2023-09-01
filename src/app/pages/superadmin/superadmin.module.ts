
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperadminRoutingModule } from './superadmin-routing.module';

import { CrearUsuariosComponent } from './pages/crear-usuarios/crear-usuarios.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { ObjetivoodsListaComponent } from './pages/objetivoods-lista/objetivoods-lista.component';
import { DialogoUsuariosComponent } from './pages/dialogo-usuarios/dialogo-usuarios.component';
import { CrearComponent } from './pages/crear-programa/crear-programa.component';
import { AprobarPoaComponent } from './pages/aprobar-poa/aprobar-poa/aprobar-poa.component';
import { DetallePoaComponent } from './pages/poacc/detalle-poa/detalle-poa/detalle-poa.component';
import { CrearcompetenciaComponent } from './pages/crear-competencia/crear-competencia.component';
import { EvidenciasRechazoComponent } from './evidencias/evidencias.component';


@NgModule({
  declarations: [
    CrearUsuariosComponent,
    ObjetivoodsListaComponent,
    DialogoUsuariosComponent,
    CrearComponent,
    AprobarPoaComponent,
    DetallePoaComponent,
    CrearcompetenciaComponent,
    EvidenciasRechazoComponent,

  ],
  imports: [
    CommonModule,
    SuperadminRoutingModule,
    SharedModule,

  ]
})
export class SuperadminModule { }
