import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubirArchivoActRoutingModule } from './subir-archivo-act-routing.module';
import { Subir_archivo_acti_desigComponent } from './subir_archivo_acti_desig/subir_archivo_acti_desig.component';
import { Actividades_desigComponent } from './actividades_desig/actividades_desig.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    Subir_archivo_acti_desigComponent,
    Actividades_desigComponent
  ],
  
  imports: [
    CommonModule,
    SubirArchivoActRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    SharedModule 
  ],
  
})
export class SubirArchivoActModule { }
