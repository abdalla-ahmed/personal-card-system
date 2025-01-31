import { Injectable } from '@angular/core';
import { HttpClientBase } from '../../shared/http-clients/http-client-base';

export class ModulePermissionDto {
    id?: number;
    description?: string;
    allowed?: boolean;
}

export class ModuleDto {
    id?: number;
    name?: string;
    category?: string;
    allowView?: boolean;
    allowCreate?: boolean;
    allowUpdate?: boolean;
    allowDelete?: boolean;
    extraPermissions?: ModulePermissionDto[]
}


@Injectable({
    providedIn: 'root'
})
export class ModuleClientService extends HttpClientBase {
    constructor() {
        super();
    }

    all() {
        return this.get<ModuleDto[]>(`modules`);
    }
}
