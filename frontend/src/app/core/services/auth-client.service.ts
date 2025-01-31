import { Injectable } from '@angular/core';
import { HttpClientBase } from '../../shared/http-clients/http-client-base';
import { User } from '../models';
import { map } from 'rxjs';

export interface LoginUserDto {
    username: string;
    password: string;
}

export interface RegisterUserDto {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}


@Injectable({
    providedIn: 'root'
})
export class AuthClientService extends HttpClientBase {

    constructor() {
        super();
    }

    login(dto: LoginUserDto) {
        return this.post<User>('auth/login', dto).pipe(map(res => User.fromJson(res)));
    }

    logout() {
        return this.post<void>('auth/logout', {});
    }

    register(dto: RegisterUserDto) {
        return this.post<User>('auth/register', dto).pipe(map(res => User.fromJson(res)));
    }

    refreshToken() {
        return this.post<User>('auth/refresh-token', {}).pipe(map(res => User.fromJson(res)));
    }

}
