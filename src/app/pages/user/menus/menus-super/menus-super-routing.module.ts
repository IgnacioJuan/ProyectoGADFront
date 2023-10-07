import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
const routes: Routes = [
  {
    path: 'menuprincipal',
    component: MenuPrincipalComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenusSuperRoutingModule { }
