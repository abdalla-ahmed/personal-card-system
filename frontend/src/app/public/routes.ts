import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'card',
    title: 'Personal Card',
    loadComponent: () => import('./card/components/shell/shell.component').then(m => m.ShellComponent),
  },
];
