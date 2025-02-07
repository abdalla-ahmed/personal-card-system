import { ChangeDetectionStrategy, Component, inject, input, model, OnInit } from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { UserForListDto } from '../../../../shared/http-clients/user-client.service';
import { UserPermissionsService } from '../../services/user-permissions.service';
import { PermissionsGridComponent } from '../../../../shared/components/permissions-grid/permissions-grid.component';
import {ExtraPermission} from "../../../../core/constants";
import {AuthService} from "../../../../core/services/auth.service";

@Component({
    selector: 'app-user-permissions-dialog',
    templateUrl: './user-permissions-dialog.component.html',
    styleUrls: ['./user-permissions-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [AppSharedModule, PermissionsGridComponent],
})
export class UserPermissionsDialogComponent implements OnInit {
    visible = model.required<boolean>();
    user = input.required<UserForListDto>();

    readonly permissionsService = inject(UserPermissionsService);

    constructor() {}

    ngOnInit() {}
}
