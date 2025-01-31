import { Routes } from '@angular/router';
import { AppLayout } from './layout/core/app-layout/app-layout.component';
import { Dashboard } from './pages/dashboard/dashboard';
import { Notfound } from './pages/notfound/notfound';
import { RouteResolver } from './core/resolvers/route-resolver.resolver';
import { AuthGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        title: 'Auth',
        resolve: [RouteResolver],
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/auth/routes').then((m) => m.routes),
    },
    {
        path: '',
        resolve: [RouteResolver],
        canActivate: [AuthGuard],
        component: AppLayout,
        children: [
            { path: 'dashboard', component: Dashboard },
            {
                path: 'cards',
                loadChildren: () => import('./modules/card/routes').then((m) => m.routes),
            },
            {
                path: 'roles',
                loadChildren: () => import('./modules/role/routes').then((m) => m.routes),
            },
            {
                path: 'users',
                loadChildren: () => import('./modules/user/routes').then((m) => m.routes),
            },
        ]
    },
    { path: '**', component: Notfound }
];
