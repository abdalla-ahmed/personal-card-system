import {EventEmitter, inject, Injectable} from '@angular/core';
import { UserManagerService } from './user-manager.service';
import { Observable, of, tap } from 'rxjs';
import { User } from '../models';
import {AuthClientService, REFRESH_TOKEN} from './auth-client.service';
import {SharedConstants} from "../constants";
import {Router} from "@angular/router";
import {HttpContext} from "@angular/common/http";
import {RoleID} from "../../shared/enums";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly router = inject(Router);
    public onUserLoggedIn = new EventEmitter<User>();
    public onTokenRefresh = new EventEmitter<User>();
    public onUserLoggedOut = new EventEmitter();

    constructor(
        private userManager: UserManagerService,
        private authClient: AuthClientService
    ) { }

    login(username: string, password: string): Observable<User> {
        return this.authClient.login({ username, password })
            .pipe(tap(user => {
                this.userManager.setUser(user);
                this.onUserLoggedIn.emit(user);
            }));
    }

    logout(onlyLocal: boolean = false): Observable<void> {
        if (onlyLocal) {
            this._localLogout();
            return of();
        }

        return this.authClient.logout().pipe(tap({
            next: () => {
                this._localLogout();
            },
            error: err => {
                this._localLogout();
            }
        }));
    }

    registerUser(username: string, email: string, password: string, passwordConfirmation: string): Observable<User> {
        return this.authClient.register({ username, email, password, passwordConfirmation })
            .pipe(tap(user => {
                this.userManager.setUser(user);
                this.onUserLoggedIn.emit(user);
            }));
    }

    reAuth(redirectToLoginPageOnError: boolean = false) {
        return this.doRefreshToken().pipe(tap({
            error: () => {
                this._localLogout();
                if(redirectToLoginPageOnError) {
                    this.router.navigate([SharedConstants.AUTH_PATH]);
                }
            }
        }));
    }

    private doRefreshToken(): Observable<User> {
        return this.authClient.refreshToken()
            .pipe(tap(user => {
                this.userManager.setUser(user);
                this.onTokenRefresh.emit(user);
            }));
    }

    private _localLogout() {
        this.userManager.clearUser();
        this.userManager.clearSession();
        this.onUserLoggedOut.emit();
    }

    get user() {
        return this.userManager.user();
    }

    get session() {
        return this.userManager.session();
    }

    get hasUser() {
        return !!this.user;
    }

    get isSuperAdmin() {
        return this.user?.username == 'admin';
    }

    get isAdmin() {
        const user = this.user;
        return user?.username == 'admin' || user.roles.includes(RoleID.Admin);
    }

    get hasSession() {
        return !!this.session;
    }

    get accessToken() {
        return this.user.token?.accessToken;
    }

    get refreshToken() {
        return this.user.token?.refreshToken;
    }

    get isLoggedIn() {
        const user = this.userManager.user();
        if (!!user) {
            if (user.token?.accessTokenExpirationDate
                && user.token.accessTokenExpirationDate > new Date
            ) {
                return true;
            }
        }
        return false;
    }

    hasExtraPermission(extraPermissionId:number) {
        if(this.hasUser){
            return this.user?.permissions?.some(x => x.extraPermissions.includes(extraPermissionId));
        }
        return false;
    }
}
