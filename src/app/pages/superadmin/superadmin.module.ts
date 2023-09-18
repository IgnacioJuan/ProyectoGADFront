
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperadminRoutingModule } from './superadmin-routing.module';

import { CrearUsuariosComponent } from './pages/crear-usuarios/crear-usuarios.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { ObjetivoodsListaComponent } from './pages/objetivoods-lista/objetivoods-lista.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormsModule  } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DialogoUsuariosComponent } from './pages/dialogo-usuarios/dialogo-usuarios.component';
import { CrearComponent } from './pages/crear-programa/crear-programa.component';
import { CustomDatePipe, ReporteavancepoaComponent } from './reporteavancepoa/reporteavancepoa.component';
import { ReporteEspecificoPoaComponent } from './reporte-especifico-poa/reporte-especifico-poa.component';
import { CrearcompetenciaComponent } from './pages/crear-competencia/crear-competencia.component';
import { ListarpoaComponent } from './flujo-criterio/listarpoa/listarpoa.component';
import { ListarporUsuarioComponent } from './flujo-criterio/listarpoaporusuario/listarpoaporusuario.component';
import { ProyectosComponent } from './flujo-criterio/listaproyecto/listaproyecto.component';
import { ReporteEspecificoCompetenciaComponent } from './reporte-especifico-competencia/reporte-especifico-competencia.component';


@NgModule({
  declarations: [
    CrearUsuariosComponent,
    ObjetivoodsListaComponent,
    ObjetivoodsListaComponent,
    ListarpoaComponent,  
    DialogoUsuariosComponent,
    CrearComponent,
    ReporteavancepoaComponent,
    ReporteEspecificoPoaComponent,
    CrearcompetenciaComponent,
    ProyectosComponent,
   
    CustomDatePipe,
    ListarpoaComponent  ,
    ListarporUsuarioComponent,
    ListSolicitudesPresupuestoSuperadminComponent,
    ReporteEspecificoCompetenciaComponent,

  ],
  imports: [
    CommonModule,
    SuperadminRoutingModule,
    SharedModule,
    

    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    NgIf,
    MatTableModule,
    MatIconModule
    
  ]
})
export class SuperadminModule { }
