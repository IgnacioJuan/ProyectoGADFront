import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { ActividadesEvidenciasrechazadasComponent } from './actividades-evidenciasrechazadas/actividades-evidenciasrechazadas.component';
import { ArchivosRechazadosComponent } from './archivos/archivos.component';

const routes: Routes = [
  {
    path: 'Actividades_Evi_Rechazados',
    component: ActividadesEvidenciasrechazadasComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'Evi_Rechazados',
    component: ArchivosRechazadosComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvidenciasRechazadasRoutingModule { }