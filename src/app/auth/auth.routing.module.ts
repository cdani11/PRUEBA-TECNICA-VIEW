import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page.component')
  },
  {
    path: '**',
    redirectTo: 'login',
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthModule { }
