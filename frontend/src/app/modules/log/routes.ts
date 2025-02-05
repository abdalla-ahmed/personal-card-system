import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Activity Log',
    loadComponent: () => import('./components/log-search/log-search.component').then(m => m.LogSearchComponent),
  },
];
