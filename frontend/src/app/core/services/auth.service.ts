import { EventEmitter, Injectable } from '@angular/core';
import { UserManagerService } from './user-manager.service';
import { Observable, of, tap } from 'rxjs';
import { User } from '../models';
import { AuthClientService } from './auth-client.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
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

    doRefreshToken(): Observable<User> {
        return this.authClient.refreshToken()
            .pipe(tap(user => {
                this.userManager.setUser(user);
                this.onTokenRefresh.emit(user);
            }));
    }

    registerUser(username: string, email: string, password: string, passwordConfirmation: string): Observable<User> {
        return this.authClient.register({ username, email, password, passwordConfirmation })
            .pipe(tap(user => {
                this.userManager.setUser(user);
                this.onUserLoggedIn.emit(user);
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
