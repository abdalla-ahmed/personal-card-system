import { ChangeDetectionStrategy, Component, inject, input, model, OnInit } from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { RoleService } from '../../services/role.service';
import { RoleForListDto } from '../../../../shared/http-clients/role-client.service';
import { PermissionsGridComponent } from '../../../../shared/components/permissions-grid/permissions-grid.component'

@Component({
    selector: 'app-role-dialog',
    templateUrl: './role-dialog.component.html',
    styleUrls: ['./role-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppSharedModule, PermissionsGridComponent]
})
export class RoleDialogComponent implements OnInit {
    visible = model.required<boolean>();
    role = input.required<RoleForListDto>();

    readonly roleService = inject(RoleService);

    constructor() { }

    ngOnInit() { }

    get form() { return this.roleService.form; }

}
