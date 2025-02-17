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
export const NO_LOADER = new HttpContextToken<boolean>(() => false);

export class HttpRequestContextToken {
    token: HttpContextToken<any>;
    value: any;
}

export abstract class HttpClientBase {
    protected readonly http = inject(HttpClient);
    protected readonly baseUrl: string;

    protected constructor(private _baseUrl?: string) {
        this.baseUrl = _baseUrl ?? SharedConstants.API_BASE_URL;
    }

    protected get<T>(url: string, contexts?: HttpRequestContextToken[]) {
        const context = this.handleContext(contexts);
        return this.http.get<T>(`${this.baseUrl}/${url}`, { context: context });
    }

    protected post<T>(
        url: string,
        data: any,
        contexts?: HttpRequestContextToken[],
    ) {
        const context = this.handleContext(contexts);
        return this.http.post<T>(`${this.baseUrl}/${url}`, data, {
            context: context,
        });
    }

    protected put<T>(
        url: string,
        data: any,
        contexts?: HttpRequestContextToken[],
    ) {
        const context = this.handleContext(contexts);
        return this.http.put<T>(`${this.baseUrl}/${url}`, data, {
            context: context,
        });
    }

    protected delete<T>(url: string, contexts?: HttpRequestContextToken[]) {
        const context = this.handleContext(contexts);
        return this.http.delete<T>(`${this.baseUrl}/${url}`, {
            context: context,
        });
    }

    protected patch<T>(
        url: string,
        data: any,
        contexts?: HttpRequestContextToken[],
    ) {
        const context = this.handleContext(contexts);
        return this.http.patch<T>(`${this.baseUrl}/${url}`, data, {
            context: context,
        });
    }

    protected head<T>(url: string, contexts?: HttpRequestContextToken[]) {
        const context = this.handleContext(contexts);
        return this.http.head<T>(`${this.baseUrl}/${url}`, {
            context: context,
        });
    }

    protected options<T>(url: string, contexts?: HttpRequestContextToken[]) {
        const context = this.handleContext(contexts);
        return this.http.options<T>(`${this.baseUrl}/${url}`, {
            context: context,
        });
    }

    private handleContext(contexts?: HttpRequestContextToken[]) {
        const context = new HttpContext().set(MAIN_API, true);
        if (contexts?.length) {
            for (const ctx of contexts) {
                context.set(ctx.token, ctx.value);
            }
        }
        return context;
    }
}
