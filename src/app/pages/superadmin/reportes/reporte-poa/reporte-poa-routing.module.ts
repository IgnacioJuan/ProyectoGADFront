import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { ReporteEspecificoPoaComponent } from './reporte-especifico-poa/reporte-especifico-poa.component';
import { ReporteavancepoaComponent } from './reporteavancepoa/reporteavancepoa.component';

const routes: Routes = [
  {
    path: 'reportePoa',
    component: ReporteavancepoaComponent,
    pathMatch: 'full',
   canActivate: [SuperGuard]
  },
  {
    path: 'reporteEspecificoPoa',
    component: ReporteEspecificoPoaComponent,
    pathMatch: 'full',
   canActivate: [SuperGuard]
  },
  { path: 'reporteEspecificoPoa/:id', 
  component: ReporteEspecificoPoaComponent ,
  pathMatch: 'full',
   canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportePoaRoutingModule { }
