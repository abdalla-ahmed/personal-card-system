import { HttpClient, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { SharedConstants } from '../../core/common/constants';

export const IS_FILE_UPLOAD = new HttpContextToken<boolean>(() => false);
export const SKIP_ERROR_HANDLING = new HttpContextToken<boolean>(() => false);

export abstract class HttpClientBase {
    protected readonly http = inject(HttpClient);
    protected readonly baseUrl: string;

    constructor(private _baseUrl?: string) {
        this.baseUrl = _baseUrl ?? SharedConstants.API_BASE_URL;
    }

    protected get<T>(url: string) {
        return this.http.get<T>(`${this.baseUrl}/${url}`);
    }

    protected post<T>(url: string, data: any) {
        return this.http.post<T>(`${this.baseUrl}/${url}`, data);
    }

    protected put<T>(url: string, data: any) {
        return this.http.put<T>(`${this.baseUrl}/${url}`, data);
    }

    protected delete<T>(url: string) {
        return this.http.delete<T>(`${this.baseUrl}/${url}`);
    }

    protected patch<T>(url: string, data: any) {
        return this.http.patch<T>(`${this.baseUrl}/${url}`, data);
    }

    protected head<T>(url: string) {
        return this.http.head<T>(`${this.baseUrl}/${url}`);
    }

    protected options<T>(url: string) {
        return this.http.options<T>(`${this.baseUrl}/${url}`);
    }
}
