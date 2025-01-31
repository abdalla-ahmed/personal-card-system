import { Component, effect, output, OnInit, model } from '@angular/core';
import { CrudToolbarCommand, FormState } from '../../interfaces';
import { AppSharedModule } from '../../../app-shared.module';

@Component({
    selector: 'app-crud-toolbar',
    templateUrl: './crud-toolbar.component.html',
    styleUrls: ['./crud-toolbar.component.css'],
    imports: [AppSharedModule]
})
export class CrudToolbarComponent implements OnInit {

    formState = model.required<FormState>();
    onCommand = output<CrudToolbarCommand>();

    isNone = false;
    isCreate = false;
    isUpdate = false;

    constructor() {
        effect(() => {
            const state = this.formState();
            this.isNone = state === FormState.None;
            this.isCreate = state === FormState.Create;
            this.isUpdate = state === FormState.Update;
        });
    }

    ngOnInit() { }


    protected onCancelClicked() {
        this.formState.set(FormState.None);
        this.onCommand.emit(CrudToolbarCommand.Cancel);
    }

    protected onCreateClicked() {
        this.formState.set(FormState.Create);
        this.onCommand.emit(CrudToolbarCommand.Create);
    }

    /*     protected onUpdateClicked() {
            this.onCommand.emit(CrudToolbarCommand.Update);
        } */

    protected onDeleteClicked() {
        this.formState.set(FormState.None);
        this.onCommand.emit(CrudToolbarCommand.Delete);
    }

    protected onSave() {
        this.formState.set(FormState.None);
        this.onCommand.emit(CrudToolbarCommand.Save);
    }
}
