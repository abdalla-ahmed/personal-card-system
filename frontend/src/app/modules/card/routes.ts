import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Cards',
    loadComponent: () => import('./components/card-search/card-search.component').then(m => m.CardSearchComponent),
  },
];
