import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarPoaComponent } from './registrar-poa/registrar-poa.component';
import { AdminGuard } from 'src/app/services/Guards/admin.guard';

const routes: Routes = [
  {
    path: 'registrarpoa',
    component: RegistrarPoaComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterPoaRoutingModule { }
