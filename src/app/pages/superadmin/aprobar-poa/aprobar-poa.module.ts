import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Importa DatePipe aquí
import { AprobarPoaRoutingModule } from './aprobar-poa-routing.module';
import { DetallePoaComponent } from './detalle-poa/detalle-poa.component';
import { AprobarPoaComponent } from './aprobar-poa/aprobar-poa.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ 
    AprobarPoaComponent,
    DetallePoaComponent
  ],
  imports: [
    CommonModule,
    AprobarPoaRoutingModule,
    SharedModule,
    NgbModule
  ],
  providers: [DatePipe] //Añade formato a las fechas
})
export class AprobarPoaModule { }
