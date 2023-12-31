
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperadminRoutingModule } from './superadmin-routing.module';
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
import { CrearComponent } from './pages/crear-programa/crear-programa.component';
import { CustomDatePipe, ReporteavancepoaComponent } from './reporteavancepoa/reporteavancepoa.component';
import { ReporteEspecificoPoaComponent } from './reporte-especifico-poa/reporte-especifico-poa.component';
import { CrearcompetenciaComponent } from './pages/crear-competencia/crear-competencia.component';
import { ListarpoaComponent } from './flujo-criterio/listarpoa/listarpoa.component';
import { ListarporUsuarioComponent } from './flujo-criterio/listarpoaporusuario/listarpoaporusuario.component';
import { ProyectosComponent } from './flujo-criterio/listaproyecto/listaproyecto.component';
@NgModule({
  declarations: [
    ObjetivoodsListaComponent,
    ObjetivoodsListaComponent,
    ListarpoaComponent,  
    
    CrearComponent,
    ReporteavancepoaComponent,
    ReporteEspecificoPoaComponent,
    CrearcompetenciaComponent,
    ProyectosComponent,
   
    CustomDatePipe,
    ListarpoaComponent  ,
    ListarporUsuarioComponent,

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
