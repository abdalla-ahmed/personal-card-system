import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { UserProfileService } from '../../services/user-profile.service';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-user-profile-shell',
    templateUrl: './user-profile-shell.component.html',
    styleUrls: ['./user-profile-shell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [AppSharedModule],
})
export class UserProfileShellComponent implements OnInit {
    readonly userProfileService = inject(UserProfileService);
    readonly currentRoute = inject(ActivatedRoute);

    constructor() {}
    ngOnInit() {
        this.userProfileService.loadProfile();
    }

    get form() {
        return this.userProfileService.form;
    }
}
