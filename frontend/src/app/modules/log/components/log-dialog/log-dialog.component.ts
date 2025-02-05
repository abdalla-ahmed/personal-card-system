import { ChangeDetectionStrategy, Component, input, model, OnInit } from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import {ActivityLogDto} from "../../../../shared/http-clients/activity-log-client.service";

@Component({
    selector: 'app-log-dialog',
    templateUrl: './log-dialog.component.html',
    styleUrls: ['./log-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [AppSharedModule],
})
export class LogDialogComponent implements OnInit {
    visible = model.required<boolean>();
    model = input.required<ActivityLogDto>();

    constructor() {}
    ngOnInit() {}
}
