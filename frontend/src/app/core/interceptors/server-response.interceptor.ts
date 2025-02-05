import { HttpErrorResponse, HttpEventType, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, map, tap } from 'rxjs';
import { AppSpinnerService } from '../../shared/services/app-spinner.service';
import { AppToastService } from '../../shared/services/app-toast.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SharedConstants } from '../common/constants';
import { UserManagerService } from '../services/user-manager.service';
import { AppSession } from '../models';
import {SKIP_ERROR_HANDLING} from "../../shared/http-clients/http-client-base";

export const ServerResponseInterceptor: HttpInterceptorFn = (req, next) => {
    const spinner = inject(AppSpinnerService);
    spinner.show();
    const router = inject(Router);
    const toast = inject(AppToastService);
    const authService = inject(AuthService);
    const userManagerService = inject(UserManagerService);

    const defaultErrMsg = 'An unknown error occurred.';

    return next(req).pipe(catchError((err: HttpErrorResponse) => {

        if(req.context.get(SKIP_ERROR_HANDLING) === true) {
            throw err;
        }

        // if the outgoing request was not heading to our api, don't check the response
        if (!req.url.toLowerCase().startsWith(SharedConstants.API_BASE_URL.toLowerCase())) {
            throw err;
        }

        let title = 'Error';
        if (err.status !== 400 && err.statusText) {
            title += ` (${err.statusText})`;
        }

        if (err.error) {
            let message = '';

            if (err.error?.message) {
                message = err.error.message;
            }

            if (err.error?.errors && Object.keys(err.error.errors).length > 0) {
                const errs: string[] = [];
                Object.keys(err.error.errors).forEach(key => {
                    errs.push(err.error.errors[key]);
                });
                const msg = errs.length > 1 ? errs.map(x => (`- ${x}`)).join('\n') : errs[0];
                if (!msg.includes(message))
                    message += '\n' + msg;
                else
                    message = msg;
            }

            toast.error(message || defaultErrMsg, title);

        } else {
            toast.error(defaultErrMsg, title);
        }

        if (err.status === 401) {
            if (!authService.hasUser) {
                router.navigate([SharedConstants.AUTH_PATH]);
            } else if (!req.url.startsWith(`${SharedConstants.API_BASE_URL}${SharedConstants.API_REFRESH_TOKEN_URL}`)) {
                authService.doRefreshToken().subscribe({
                    next: () => { toast.info('You has been re-logged in.'); },
                    error: () => {
                        authService.logout(true).subscribe({
                            next: () => { router.navigate([SharedConstants.AUTH_PATH]); }
                        });
                    }
                });
            }
        }

        throw err;
    }), map(event => {
        if (event.type === HttpEventType.Response) {
            if (event.headers.has('X-Session-ID')) {
                userManagerService.setSession(AppSession.fromJson({ sessionId: event.headers.get('X-Session-ID') }));
            }
            event = event.clone({ body: (event.body as any)?.data });
        }
        return event;
    }), finalize(() => spinner.hide()));
};
