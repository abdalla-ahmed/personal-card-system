import { ChangeDetectionStrategy, Component, model, OnInit } from '@angular/core';
import { AppSharedModule } from '../../../app-shared.module';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { CheckboxChangeEvent } from 'primeng/checkbox';

@Component({
    selector: 'app-permissions-grid',
    templateUrl: './permissions-grid.component.html',
    styleUrls: ['./permissions-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppSharedModule]
})
export class PermissionsGridComponent implements OnInit {
    dataSource = model.required<any[]>(); // TODO: specify a generic type/interface

    expandedRows = {};

    constructor() { }

    ngOnInit() { }

    expandAll() {
        this.dataSource().forEach(permission => !permission.extraPermissions?.length || (this.expandedRows[permission.id] = true));
    }

    collapseAll() {
        this.expandedRows = {};
    }

    onRowExpand(event: TableRowExpandEvent) {
    }

    onRowCollapse(event: TableRowCollapseEvent) {
    }

    onSelectAllChanged(event: CheckboxChangeEvent) {
        const field = (event.originalEvent.target as HTMLInputElement).name;
        this.dataSource.update(x => {
            x.forEach(m => {
                m[field] = event.checked;
            });
            return x;
        });
    }

    get allowViewTotalValue(): boolean | null {
        const permissions = this.dataSource();
        const all = permissions.every(x => x.allowView);
        const some = permissions.some(x => x.allowView);
        return all ? true : (some ? null : false);
    }

    get allowCreateTotalValue(): boolean | null {
        const permissions = this.dataSource();
        const all = permissions.every(x => x.allowCreate);
        const some = permissions.some(x => x.allowCreate);
        return all ? true : (some ? null : false);
    }

    get allowUpdateTotalValue(): boolean | null {
        const permissions = this.dataSource();
        const all = permissions.every(x => x.allowUpdate);
        const some = permissions.some(x => x.allowUpdate);
        return all ? true : (some ? null : false);
    }

    get allowDeleteTotalValue(): boolean | null {
        const permissions = this.dataSource();
        const all = permissions.every(x => x.allowDelete);
        const some = permissions.some(x => x.allowDelete);
        return all ? true : (some ? null : false);
    }
}
