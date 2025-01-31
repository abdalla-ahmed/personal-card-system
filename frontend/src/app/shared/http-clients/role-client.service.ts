import { Injectable } from '@angular/core';
import { HttpClientBase } from './http-client-base';

export interface RoleForListDto {
    id: number;
    name: string;
    static: boolean;
}

export interface RoleDto {
    id: number;
    name: string;
    static: boolean;
    permissions: RoleModule[];
}

export interface CreateRoleDto {
    name: string;
    permissions: CreateOrUpdateRoleModule[];
}

export interface UpdateRoleDto {
    id: number;
    name: string;
    permissions: CreateOrUpdateRoleModule[];
}

export class RoleModulePermission {
    id?: number;
    description?: string;
    allowed?: boolean;
}

export class RoleModule {
    id?: number;
    name?: string;
    category?: string;
    allowView?: boolean;
    allowCreate?: boolean;
    allowUpdate?: boolean;
    allowDelete?: boolean;
    extraPermissions?: RoleModulePermission[]
}

export class CreateOrUpdateRoleModule {
    id: number;
    allowView: boolean;
    allowCreate: boolean;
    allowUpdate: boolean;
    allowDelete: boolean;
    extraPermissions: number[]
}

@Injectable({
    providedIn: 'root'
})
export class RoleClientService extends HttpClientBase {
    constructor() {
        super();
    }

    all() {
        return this.get<RoleForListDto[]>(`roles`);
    }

    getById(id: number) {
        return this.get<RoleDto>(`roles/${id}`);
    }

    createRole(dto: CreateRoleDto) {
        return this.post(`roles`, dto);
    }

    updateRole(dto: UpdateRoleDto) {
        return this.put(`roles/${dto.id}`, dto);
    }

    deleteRole(id: number) {
        return this.delete(`roles/${id}`);
    }
}
