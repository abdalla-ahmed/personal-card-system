import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Users',
    loadComponent: () => import('./components/user-search/user-search.component').then(m => m.UserSearchComponent),
  },
];
