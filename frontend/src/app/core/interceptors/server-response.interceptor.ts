import {
    HttpErrorResponse,
    HttpEventType,
    HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, map, tap } from 'rxjs';
import { AppSpinnerService } from '../../shared/services/app-spinner.service';
import { AppToastService } from '../../shared/services/app-toast.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SharedConstants } from '../constants';
import { UserManagerService } from '../services/user-manager.service';
import { AppSession } from '../models';
import {
    NO_LOADER,
    MAIN_API,
    SKIP_API_ERROR_RESPONSE_HANDLING
} from '../../shared/http-clients/http-client-base';
import { REFRESH_TOKEN } from '../services/auth-client.service';

export const ServerResponseInterceptor: HttpInterceptorFn = (req, next) => {
    const spinner = inject(AppSpinnerService);
    const router = inject(Router);
    const toast = inject(AppToastService);
    const authService = inject(AuthService);
    const userManagerService = inject(UserManagerService);
    
    if (req.context.get(NO_LOADER) === false) {
        spinner.show();
    }
    
    const defaultErrMsg = 'An unknown error occurred.';

    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            if (req.context.get(SKIP_API_ERROR_RESPONSE_HANDLING) === true) {
                throw err;
            }

            // if the outgoing request was not heading to our api, don't check the response
            if (req.context.get(MAIN_API) === false) {
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

                if (
                    err.error?.errors &&
                    Object.keys(err.error.errors).length > 0
                ) {
                    const errs: string[] = [];
                    Object.keys(err.error.errors).forEach((key) => {
                        errs.push(err.error.errors[key]);
                    });
                    const msg =
                        errs.length > 1
                            ? errs.map((x) => `- ${x}`).join('\n')
                            : errs[0];
                    if (!msg.includes(message)) message += '\n' + msg;
                    else message = msg;
                }

                toast.error(message || defaultErrMsg, title);
            } else {
                toast.error(defaultErrMsg, title);
            }

            if (err.status === 401) {
                if (!authService.hasUser) {
                    router.navigate([SharedConstants.AUTH_PATH]);
                } else if (req.context.get(REFRESH_TOKEN) === false) {
                    authService.reAuth(true).subscribe({
                        next: () => {
                            toast.info('You has been re-logged in.');
                        },
                    });
                }
            }

            throw err;
        }),
        map((event) => {
            if (
                event.type === HttpEventType.Response &&
                req.context.get(MAIN_API) === true
            ) {
                if (event.headers.has('X-Session-ID')) {
                    userManagerService.setSession(
                        AppSession.fromJson({
                            sessionId: event.headers.get('X-Session-ID'),
                        }),
                    );
                }
                if (event.body?.hasOwnProperty('data')) {
                    event = event.clone({ body: (<any>event.body).data });
                }
            }
            return event;
        }),
        finalize(() => {
            if (req.context.get(NO_LOADER) === false) {
                spinner.hide();
            }
        }),
    );
};
