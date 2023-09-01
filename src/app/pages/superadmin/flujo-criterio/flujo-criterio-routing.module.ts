import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { EvaluacionCuantitativaComponent } from './evaluacion-cuantitativa/evaluacion-cuantitativa.component';
import { CrearcompetenciaComponent } from '../pages/crear-competencia/crear-competencia.component';
import { CrearComponent } from '../pages/crear-programa/crear-programa.component';
import { CriteriosSubcriterioComponent } from './criterios-subcriterio/criterios-subcriterio.component';
import { CriteriosComponent } from './criterios/criterios.component';
import { IndicadoresEvidenciaComponent } from './indicadores-evidencia/indicadores-evidencia.component';
import { ListarpoaComponent } from './listarpoa/listarpoa.component';
import { SubcriteriosIndicadorComponent } from './subcriterios-indicador/subcriterios-indicador.component';
import { ListarporUsuarioComponent } from './listarpoaporusuario/listarpoaporusuario.component';



const routes: Routes = [
  {
    path: 'criterioSuper',
    component: CriteriosComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'criterios-subcriterio',
    component: CriteriosSubcriterioComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'indicador-evidencia',
    component: IndicadoresEvidenciaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'crearpro',
    component: CrearComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'listarpoa',
    component: ListarpoaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'listarpoausu',
    component: ListarporUsuarioComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'crearcompe',
    component: CrearcompetenciaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  {
    path: 'subcriterios-indicador',
    component: SubcriteriosIndicadorComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  }
  ,
  {
    path: 'evaluacion-cuantitativa',
    component: EvaluacionCuantitativaComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoCriterioRoutingModule { }
