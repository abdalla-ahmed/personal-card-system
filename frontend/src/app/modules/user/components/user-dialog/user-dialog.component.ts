import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    model,
    OnInit,
} from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { UserService } from '../../services/user.service';
import { UserForListDto } from '../../../../shared/http-clients/user-client.service';
import { RoleForListDto } from '../../../../shared/http-clients/role-client.service';
import {AuthService} from "../../../../core/services/auth.service";
import {ExtraPermission} from "../../../../core/constants";

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [AppSharedModule],
})
export class UserDialogComponent implements OnInit {
    visible = model.required<boolean>();
    user = input.required<UserForListDto>();
    roles = input.required<RoleForListDto[]>();

    readonly userService = inject(UserService);

    protected securityLevels: { id: number; label: string }[] = [
        { id: 1, label: '1' },
        { id: 2, label: '2' },
        { id: 3, label: '3' },
        { id: 4, label: '4' },
        { id: 5, label: '5' },
    ];

    constructor() {}

    ngOnInit() {}

    get form() {
        return this.userService.form;
    }
}
