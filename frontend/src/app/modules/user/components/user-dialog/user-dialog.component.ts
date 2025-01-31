import { ChangeDetectionStrategy, Component, inject, input, model, OnInit } from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { UserService } from '../../services/user.service';
import { UserForListDto } from '../../../../shared/http-clients/user-client.service';
import { RoleForListDto } from '../../../../shared/http-clients/role-client.service';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppSharedModule]
})
export class UserDialogComponent implements OnInit {
    visible = model.required<boolean>();
    user = input.required<UserForListDto>();
    roles = input.required<RoleForListDto[]>();

    readonly userService = inject(UserService);

    constructor() { }

    ngOnInit() {
    }

    get form() { return this.userService.form; }

}
