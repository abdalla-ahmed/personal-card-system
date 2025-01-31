import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SharedConstants } from '../common/constants';
import { IS_FILE_UPLOAD } from '../../shared/http-clients/http-client-base';

export const ServerRequestInterceptor: HttpInterceptorFn = (req, next) => {

    // continue as normal if the outgoing request is not heading to our api
    if (!req.url.toLowerCase().startsWith(SharedConstants.API_BASE_URL.toLowerCase())) {
        return next(req);
    }

    const authService = inject(AuthService);

    const headers: any = {
        'Accept-Language': 'en-US',
    };

    headers['Content-Type'] = 'application/json';

    if (req.context.get(IS_FILE_UPLOAD) === true) {
        delete headers['Content-Type'];
    }

    headers['Accept'] = 'application/json';

    if (authService.hasSession) {
        headers['X-Session-ID'] = authService.session.sessionId;
    }

    if (authService.hasUser) {
        if (authService.isLoggedIn) {
            headers['Authorization'] = `Bearer ${authService.accessToken}`;
        } else if (req.url.startsWith(`${SharedConstants.API_BASE_URL}${SharedConstants.API_REFRESH_TOKEN_URL}`)) {
            headers['Authorization'] = `Bearer ${authService.refreshToken}`;
        }
    }

    const reqClone = req.clone({ setHeaders: headers });
    return next(reqClone);
};

