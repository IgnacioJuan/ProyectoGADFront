import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {} from './menus.module';
import { SuperGuard } from 'src/app/services/Guards/super.guard';

const routes: Routes = [
  {
    path: 'menusuper',
    loadChildren: () => import("./menus-super/menus-super.module").then(m => m.MenusSuperModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenusRoutingModule { }
