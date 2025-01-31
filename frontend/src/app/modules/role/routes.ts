import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Roles',
    loadComponent: () => import('./components/role-search/role-search.component').then(m => m.RoleSearchComponent),
  },
];
