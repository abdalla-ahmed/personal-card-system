import { ModelBase } from './';

export class User extends ModelBase {
    userId: number;
    username: string;
    roles: number[];
    token: UserAccessToken;
    permissions: UserModulePermission[];
}

export class UserAccessToken {
    accessToken: string;
    accessTokenExpirationDate: Date;
    refreshToken: string;
    refreshTokenExpirationDate: Date;
}

export class UserModulePermission {
    moduleId: number;
    allowView: boolean;
    allowCreate: boolean;
    allowUpdate: boolean;
    allowDelete: boolean;
    extraPermissions: number[]
}
