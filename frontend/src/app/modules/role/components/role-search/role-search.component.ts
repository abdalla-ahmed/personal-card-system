import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Menu } from 'primeng/menu';
import { RoleService } from '../../services/role.service';
import { RoleClientService, RoleForListDto } from '../../../../shared/http-clients/role-client.service';
import { AppToastService } from '../../../../shared/services/app-toast.service'
import { SubSink } from 'subsink';
import { RoleDialogComponent } from '../role-dialog/role-dialog.component';

@Component({
    selector: 'app-role-search',
    templateUrl: './role-search.component.html',
    styleUrl: './role-search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppSharedModule, RoleDialogComponent],
})
export class RoleSearchComponent implements OnInit, OnDestroy {
    private readonly subs = new SubSink();

    readonly roleService = inject(RoleService);
    readonly roleClient = inject(RoleClientService);
    readonly toast = inject(AppToastService);
    readonly currentRoute = inject(ActivatedRoute);

    @ViewChild('rowMenu') rowMenu!: Menu;

    rowActions: MenuItem[] = [];

    roles = signal<RoleForListDto[]>([]);
    selectedRole?: RoleForListDto;

    get form() { return this.roleService.form; }

    constructor() {
        this.subs.sink = this.roleService.roleCreated
            .subscribe(roleId => {
                this.getAllRoles();
            });
        this.subs.sink = this.roleService.roleUpdated
            .subscribe(roleId => {
                this.getAllRoles();
            });
        this.subs.sink = this.roleService.roleDeleted
            .subscribe(roleId => {
                this.getAllRoles();
            });
    }

    ngOnInit() {
        this.rowActions = [
            {
                label: 'Edit',
                command: (e) => { this.roleService.showEditRoleDialog(this.selectedRole); }
            },
            {
                label: 'Delete',
                command: (e) => { this.roleService.deleteRole(this.selectedRole); }
            },
        ];

        this.getAllRoles();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    private getAllRoles() {
        this.subs.sink = this.roleClient.all()
            .subscribe(roles => {
                this.roles.set(roles);
            });
    }

    onActionsBtnClick(e: any, rowData: any) {
        this.selectedRole = rowData;
        this.rowMenu.toggle(e);
    }
}
