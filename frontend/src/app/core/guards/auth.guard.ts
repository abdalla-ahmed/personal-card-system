import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    RedirectCommand,
    Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SharedConstants } from '../constants';
import { AppToastService } from '../../shared/services/app-toast.service';
import { map, tap } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toast = inject(AppToastService);

    const authPathNoSlash = SharedConstants.AUTH_PATH.substring(1);

    const isAuthRoute = (route: ActivatedRouteSnapshot) => {
        return route.url[0]?.path == authPathNoSlash;
    };

    if (authService.isLoggedIn) {
        if (isAuthRoute(route)) {
            return new RedirectCommand(
                router.parseUrl(SharedConstants.BASE_PATH),
            );
        }
    } else {
        if (!isAuthRoute(route) && authService.hasUser) {
            return authService.reAuth(true).pipe(
                tap({
                    next: () => {
                        toast.info('You has been re-logged in.');
                    },
                }),
                map((x) => true),
            );
        }

        if (!isAuthRoute(route)) {
            return new RedirectCommand(
                router.parseUrl(SharedConstants.AUTH_PATH),
            );
        }
    }

    return true;
};
