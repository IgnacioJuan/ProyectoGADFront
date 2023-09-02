import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentesComponent } from './componentes/componentes.component';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { ComponenteObjetivoPdotComponent } from './componente-objetivo-pdot/componente-objetivo-pdot.component';
import { MetasPdotIndicadoresComponent } from './metas-pdot-indicadores/metas-pdot-indicadores.component';
import { ObjetivoPdotMetasPdotComponent } from './objetivo-pdot-metas-pdot/objetivo-pdot-metas-pdot.component';

const routes: Routes = [
  {
    path: 'componentesSuper',
    component: ComponentesComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'componente_objetivoPDOT',
    component: ComponenteObjetivoPdotComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'objetivoPDOT_metasPDOT',
    component: ObjetivoPdotMetasPdotComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'metasPDOT_Indicadores',
    component: MetasPdotIndicadoresComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoComponentesRoutingModule { }
