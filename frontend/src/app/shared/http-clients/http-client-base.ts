import {
    HttpClient,
    HttpContext,
    HttpContextToken,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { SharedConstants } from '../../core/constants';

export const MAIN_API = new HttpContextToken<boolean>(() => false);
export const IS_FILE_UPLOAD = new HttpContextToken<boolean>(() => false);
export const SKIP_API_ERROR_RESPONSE_HANDLING = new HttpContextToken<boolean>(
    () => false,
);

export abstract class HttpClientBase {
    protected readonly http = inject(HttpClient);
    protected readonly baseUrl: string;

    constructor(private _baseUrl?: string) {
        this.baseUrl = _baseUrl ?? SharedConstants.API_BASE_URL;
    }

    protected get<T>(url: string, context?: HttpContext) {
        return this.http.get<T>(`${this.baseUrl}/${url}`, { context: context });
    }

    protected post<T>(url: string, data: any, context?: HttpContext) {
        return this.http.post<T>(`${this.baseUrl}/${url}`, data, {
            context: context,
        });
    }

    protected put<T>(url: string, data: any, context?: HttpContext) {
        return this.http.put<T>(`${this.baseUrl}/${url}`, data, {
            context: context,
        });
    }

    protected delete<T>(url: string, context?: HttpContext) {
        return this.http.delete<T>(`${this.baseUrl}/${url}`, {
            context: context,
        });
    }

    protected patch<T>(url: string, data: any, context?: HttpContext) {
        return this.http.patch<T>(`${this.baseUrl}/${url}`, data, {
            context: context,
        });
    }

    protected head<T>(url: string, context?: HttpContext) {
        return this.http.head<T>(`${this.baseUrl}/${url}`, {
            context: context,
        });
    }

    protected options<T>(url: string, context?: HttpContext) {
        return this.http.options<T>(`${this.baseUrl}/${url}`, {
            context: context,
        });
    }
}
