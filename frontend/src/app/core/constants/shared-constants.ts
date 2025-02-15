import PackageJson from '../../../../package.json';

export class SharedConstants {
    static readonly BASE_PATH = '/';
    static readonly AUTH_PATH = '/auth';
    static readonly SERVER_BASE_URL = PackageJson.config.baseUrl;
    static readonly API_BASE_URL = PackageJson.config.api.baseUrl;
}
