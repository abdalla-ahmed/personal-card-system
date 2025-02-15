import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'My Profile',
    loadComponent: () => import('./components/user-profile-shell/user-profile-shell.component').then(m => m.UserProfileShellComponent),
  },
];
