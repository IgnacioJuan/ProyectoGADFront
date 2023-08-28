import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SuperGuard} from "../../../services/Guards/super.guard";
import {EjesListaComponent} from "./ejes-lista/ejes-lista.component";
import {ObjetivopndComponent} from "./objetivopnd/objetivopnd.component";

const routes: Routes = [{
  path: 'ejestabla',
  component: EjesListaComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},{
  path: 'objetivopnd',
  component: ObjetivopndComponent,
  pathMatch: 'full',
  canActivate: [SuperGuard]
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EjesRoutingModule { }
