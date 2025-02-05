import { Injectable } from '@angular/core';
import { HttpClientBase } from './http-client-base';
import { ModelBase } from '../../core/models';
import { map } from 'rxjs';

export class ActivityLogForListDto extends ModelBase {
    id: number;
    createdAt: Date;
    ipAddress: string;
    action: string;
    entityType: string;
    entityId: string;
    user: ActivityLogUserDto;
    module: ActivityLogModuleDto;
}

export class ActivityLogDto extends ModelBase {
    id: number;
    createdAt: Date;
    ipAddress: string;
    userAgent: string;
    action: string;
    entityType: string;
    entityId: string;
    oldData: string;
    newData: string;
    user: ActivityLogUserDto;
    module: ActivityLogModuleDto;
}

export interface ActivityLogUserDto {
    id: number;
    username: string;
}

export interface ActivityLogModuleDto {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class ActivityLogClientService extends HttpClientBase {
    constructor() {
        super();
    }

    all() {
        return this.get<ActivityLogForListDto[]>(`activity-logs`).pipe(
            map((x) => x.map((y) => ActivityLogForListDto.fromJson(y))),
        );
    }

    getById(id: number) {
        return this.get<ActivityLogDto>(`activity-logs/${id}`).pipe(
            map((x) => ActivityLogDto.fromJson(x)),
        );
    }

    purge() {
        return this.delete(`activity-logs`);
    }
}
