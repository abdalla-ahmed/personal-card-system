import { Routes } from '@angular/router';
import { AppLayout } from './layout/core/app-layout/app-layout.component';
import { Dashboard } from './pages/dashboard/dashboard';
import { Notfound } from './pages/notfound/notfound';
import { RouteResolver } from './core/resolvers/route-resolver.resolver';
import { AuthGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'internal',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        resolve: [RouteResolver],
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./modules/auth/routes').then((m) => m.routes),
    },
    {
        path: 'public',
        resolve: [RouteResolver],
        loadChildren: () => import('./public/routes').then((m) => m.routes),
    },
    {
        path: 'internal',
        resolve: [RouteResolver],
        canActivate: [AuthGuard],
        component: AppLayout,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            { path: 'dashboard', component: Dashboard },
            {
                path: 'cards',
                loadChildren: () =>
                    import('./modules/card/routes').then((m) => m.routes),
            },
            {
                path: 'roles',
                loadChildren: () =>
                    import('./modules/role/routes').then((m) => m.routes),
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('./modules/user/routes').then((m) => m.routes),
            },
            {
                path: 'activity-log',
                loadChildren: () =>
                    import('./modules/log/routes').then((m) => m.routes),
            },
        ],
    },
    { path: '**', component: Notfound },
];
