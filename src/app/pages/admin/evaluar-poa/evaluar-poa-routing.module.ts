import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoasComponent } from './poas/poas.component';
import { RoleguardGuard } from 'src/app/services/Guards/roleguard.guard';

const routes: Routes = [
  {
    path: 'poas',
    component: PoasComponent,
    pathMatch: 'full',
    canActivate: [RoleguardGuard],
    data: { allowedRoles: ['SUPERADMIN', 'ADMIN'] }

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluarPoaRoutingModule { }
