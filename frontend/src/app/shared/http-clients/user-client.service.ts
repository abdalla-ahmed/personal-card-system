import { Injectable } from '@angular/core';
import { HttpClientBase } from '../../shared/http-clients/http-client-base';

export interface UserForListDto {
    id?: number;
    username?: string;
    email?: string;
    roles?: UserRoleDto[];
}

export interface UserRoleDto {
    id?: number;
    userId?: number;
    name?: string;
}

export interface UserDto {
    id?: number;
    username?: string;
    email?: string;
    roles?: number[];
}

export interface CreateUserDto {
    username?: string;
    email?: string;
    password?: string;
    roles?: number[];
}

export interface UpdateUserDto {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    roles?: number[];
}

export class UserModulePermission {
    id?: number;
    description?: string;
    allowed?: boolean;
}

export class UserModule {
    id?: number;
    name?: string;
    category?: string;
    allowView?: boolean;
    allowCreate?: boolean;
    allowUpdate?: boolean;
    allowDelete?: boolean;
    extraPermissions?: UserModulePermission[]
}

export class UserPermissions {
    userId: number;
    permissions: UserModule[];
}

export class UpdateUserModule {
    id: number;
    allowView: boolean;
    allowCreate: boolean;
    allowUpdate: boolean;
    allowDelete: boolean;
    extraPermissions: number[]
}

export class UpdateUserPermissionsDto {
    userId?: number;
    permissions?: UpdateUserModule[];
}

@Injectable({
    providedIn: 'root'
})
export class UserClientService extends HttpClientBase {
    constructor() {
        super();
    }

    all() {
        return this.get<UserForListDto[]>(`users`);
    }

    getById(id: number) {
        return this.get<UserDto>(`users/${id}`);
    }

    createUser(dto: CreateUserDto) {
        return this.post(`users`, dto);
    }

    updateUser(dto: UpdateUserDto) {
        return this.put(`users/${dto.id}`, dto);
    }

    deleteUser(id: number) {
        return this.delete(`users/${id}`);
    }

    permissions(userId: number) {
        return this.get<UserPermissions>(`users/${userId}/permissions`);
    }

    updatePermissions(dto: UpdateUserPermissionsDto) {
        return this.put(`users/${dto.userId}/permissions`, dto);
    }
}
