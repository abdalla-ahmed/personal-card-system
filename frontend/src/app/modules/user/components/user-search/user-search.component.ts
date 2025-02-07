import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { Menu } from 'primeng/menu';
import { UserService } from '../../services/user.service';
import { UserForListDto } from '../../../../shared/http-clients/user-client.service';
import { AppToastService } from '../../../../shared/services/app-toast.service'
import { SubSink } from 'subsink';
import { RoleID } from '../../../../shared/enums';
import { RoleForListDto } from '../../../../shared/http-clients/role-client.service';
import { combineLatest } from 'rxjs';
import { UserPermissionsService } from '../../services/user-permissions.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UserPermissionsDialogComponent } from '../user-permissions-dialog/user-permissions-dialog.component';
import {AuthService} from "../../../../core/services/auth.service";
import {ExtraPermission} from "../../../../core/constants";

@Component({
    selector: 'app-user-search',
    templateUrl: './user-search.component.html',
    styleUrl: './user-search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppSharedModule, UserDialogComponent, UserPermissionsDialogComponent],
})
export class UserSearchComponent implements OnInit, OnDestroy {
    private readonly subs = new SubSink();

    readonly userService = inject(UserService);
    readonly permissionsService = inject(UserPermissionsService);
    readonly toast = inject(AppToastService);
    readonly currentRoute = inject(ActivatedRoute);

    @ViewChild('usersDataGrid') dataGrid!: Table;
    @ViewChild('rowMenu') rowMenu!: Menu;

    rowActions: MenuItem[] = [];

    users = signal<UserForListDto[]>([]);
    selectedUser?: UserForListDto;

    roles: RoleForListDto[] = [];

    get form() { return this.userService.form; }

    constructor() {
        this.subs.sink = this.userService.userCreated
            .subscribe(userId => {
                this.getAllUsers();
            });
        this.subs.sink = this.userService.userUpdated
            .subscribe(userId => {
                this.getAllUsers();
            });
        this.subs.sink = this.userService.userDeleted
            .subscribe(userId => {
                this.getAllUsers();
            });
    }

    ngOnInit() {
        this.rowActions = [
            {
                label: 'Edit',
                command: (e) => { this.userService.showEditUserDialog(this.selectedUser); }
            },
            {
                label: 'Special Permissions',
                command: (e) => { this.permissionsService.showUserPermissionsDialog(this.selectedUser); }
            },
            {
                label: 'Delete',
                command: (e) => { this.userService.deleteUser(this.selectedUser); }
            },
        ];

        this.subs.sink = combineLatest([
            this.userService.roleClient.all(),
            this.userService.userClient.all()
        ]).subscribe(([roles, users]) => {
            this.roles = roles;
            this.users.set(users);
        });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    private getAllUsers() {
        this.subs.sink = this.userService.userClient.all()
            .subscribe(users => {
                this.users.set(users);
            });
    }

    onActionsBtnClick(e: any, rowData: any) {
        this.selectedUser = rowData;
        this.rowMenu.toggle(e);
    }

    getRoleTagSeverity(roleId: number) {
        switch (roleId) {
            case RoleID.Admin: return 'success';
            case RoleID.User: return 'info';
        }
        return 'contrast';
    }

}
