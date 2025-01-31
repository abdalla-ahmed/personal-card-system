import { Injectable } from '@angular/core';
import { AppSession, User } from '../models';

@Injectable({
    providedIn: 'root'
})
export class UserManagerService {
    private _user: User | null = null;
    private _session: AppSession | null = null;

    constructor() { }

    setUser(user: User) {
        this._user = user;
        localStorage.setItem('app_user', user.toJson());
    }

    user(): User | null {
        if (!!this._user) {
            return this._user;
        }
        const userJson = localStorage.getItem('app_user');
        if (userJson) {
            return User.fromJson(userJson);
        }
        return null;
    }

    clearUser() {
        this._user = null;
        localStorage.removeItem('app_user');
    }


    setSession(session: AppSession) {
        this._session = session;
        localStorage.setItem('app_session', session.toJson());
    }

    session(): AppSession | null {
        if (!!this._session) {
            return this._session;
        }
        const sessionJson = localStorage.getItem('app_session');
        if (sessionJson) {
            return AppSession.fromJson(sessionJson);
        }
        return null;
    }

    clearSession() {
        this._session = null;
        localStorage.removeItem('app_session');
    }
}
