import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Importa DatePipe aquí
import { AprobarPoaRoutingModule } from './aprobar-poa-routing.module';
import { DetallePoaComponent } from './detalle-poa/detalle-poa.component';
import { AprobarPoaComponent } from './aprobar-poa/aprobar-poa.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReporteUsuariosComponent } from './reporte-usuarios/reporte-usuarios.component';

@NgModule({
  declarations: [ 
    AprobarPoaComponent,
    DetallePoaComponent,
    ReporteUsuariosComponent
  ],
  imports: [
    CommonModule,
    AprobarPoaRoutingModule,
    SharedModule,
    NgbModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  providers: [DatePipe] //Añade formato a las fechas
})
export class AprobarPoaModule { }
