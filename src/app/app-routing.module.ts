
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';


const routes: Routes = [

  
  
  { path: '', redirectTo: 'use/login', pathMatch: 'full' },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },

  //PATHS DE ADMINISTRADOR
  {
    path: 'adm',
    loadChildren: () => import("./pages/admin/admin.module").then(m => m.AdminModule)
  },
  

  //PATHS DE SUPERADMIN

  {
    path: 'sup',
    loadChildren: () => import("./pages/superadmin/superadmin.module").then(m => m.SuperadminModule)
  },
  

  
  
  //PATHS DE RESPONSABLE
  {
    path: 'res',
    loadChildren: () => import("./pages/responsable/responsable.module").then(m => m.ResponsableModule)
  },
  



  //Otros Paths
  {
    path: 'use',
    loadChildren: () => import("./pages/user/user.module").then(m => m.UserModule)
  },
  {
    path: 'pagenotfoud',
    component: PageNotFoundComponent
  },

  {
    path: 'repor',
    loadChildren: () => import("./pages/reportes/reportes.module").then(m => m.ReportesModule)  },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
