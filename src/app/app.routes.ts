import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routing.module').then(m=> m.AuthModule),
  },
  {
    path: 'inicio',
    //canActivate: [authenticatedGuard],
    loadChildren: ()=> import('./dashboard/dashboard-routing.module').then(m=> m.DashboardRoutingModule),
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
