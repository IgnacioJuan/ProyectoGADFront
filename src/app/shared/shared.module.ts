import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { BuscarPipe } from './buscar.pipe';
import { BuscarUsuarioPipe } from './buscar-usuario.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTreeModule } from '@angular/material/tree';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule, MomentDateModule } from '@angular/material-moment-adapter';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkTableModule } from '@angular/cdk/table';
import { ResponsablePipe } from '../pages/admin/asignacion-evidencia/responsable.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltrarEvidenciasPorIDPipe } from '../pages/admin/aprobar-rechazar-admin/filtro-prueba.pipe';
import { MatSortModule } from '@angular/material/sort';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';
import { SafePipe } from './safe.pipe';
import { MatDividerModule } from '@angular/material/divider';
@NgModule({
  declarations: [BuscarPipe,BuscarUsuarioPipe,PageNotFoundComponent,
    FiltrarEvidenciasPorIDPipe, ResponsablePipe,LoadingSpinnerComponent,SafePipe
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    FontAwesomeModule, 
    MatSelectModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTreeModule,
    MatStepperModule,
    MatMomentDateModule,
    MomentDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatListModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    CdkTableModule,
    MatTooltipModule,
    MatSortModule,
  ],
  exports: [
    BuscarPipe,
    ResponsablePipe,
    BuscarUsuarioPipe,
    PageNotFoundComponent,
    FiltrarEvidenciasPorIDPipe,
    CdkTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    FontAwesomeModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTreeModule,
    MatStepperModule,
    MatMomentDateModule,
    MomentDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatListModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatTabsModule,
    MatSortModule,
    LoadingSpinnerComponent,
    NgIf,
    SafePipe,
  ],
})
export class SharedModule { }
