import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';
import { SuperGuard } from 'src/app/services/Guards/super.guard';
import { DialogoUsuariosComponent } from './dialogo-usuarios/dialogo-usuarios.component';

const routes: Routes = [
  {
    path: 'usuarios',
    component: CrearUsuariosComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
  
  {
    path: 'crearUsu',
    component: DialogoUsuariosComponent,
    pathMatch: 'full',
    canActivate: [SuperGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrearUsuariosRoutingModule { }
