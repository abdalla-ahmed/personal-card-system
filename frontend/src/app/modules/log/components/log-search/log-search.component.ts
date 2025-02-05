import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
    OnInit,
    signal,
} from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { ActivatedRoute } from '@angular/router';
import { AppToastService } from '../../../../shared/services/app-toast.service';
import { SubSink } from 'subsink';
import {
    ActivityLogClientService,
    ActivityLogDto,
    ActivityLogForListDto,
} from '../../../../shared/http-clients/activity-log-client.service';
import { LogDialogComponent } from '../log-dialog/log-dialog.component';
import {AppConfirmationService} from "../../../../shared/services/app-confirmation.service";
import moment from "moment";

@Component({
    selector: 'app-log-search',
    templateUrl: './log-search.component.html',
    styleUrl: './log-search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppSharedModule, LogDialogComponent],
    standalone: true,
})
export class LogSearchComponent implements OnInit, OnDestroy {
    private readonly subs = new SubSink();

    readonly activityLogClient = inject(ActivityLogClientService);
    readonly toast = inject(AppToastService);
    readonly currentRoute = inject(ActivatedRoute);
    readonly confirmation = inject(AppConfirmationService);

    logs = signal<ActivityLogForListDto[]>([]);
    dialogVisible = signal<boolean>(false);
    dialogData = signal<ActivityLogDto>(null);

    constructor() {}

    ngOnInit() {
        this.getAllRoles();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    private getAllRoles() {
        this.subs.sink = this.activityLogClient.all().subscribe((logs) => {
            this.logs.set(logs);
        });
    }

    onOpenBtnClick(rowData: ActivityLogForListDto) {
        this.subs.sink = this.activityLogClient
            .getById(rowData.id)
            .subscribe((x) => {
                this.dialogData.set(x);
                this.dialogVisible.set(true);
            });
    }

    onPurgeBtnClick() {
        this.confirmation.confirm({
            message: `Are you sure you want to delete all activity logs ?`,
            accept: () => {
                this.subs.sink = this.activityLogClient.purge().subscribe(() => {
                    this.toast.success('Activity Logs deleted successfully');
                });
            }
        });
    }

    formatDate(date: Date) {
        return moment(date, moment.ISO_8601, true).format('DD-MM-yyyy hh:mm:ss A');
    }
}
