import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class AppConfirmationService {
    readonly confirmationService = inject(ConfirmationService);

    constructor() { }

    confirm(options: { message: string, title?: string, icon?: string, accept?: Function, reject?: Function }) {
        this.confirmationService.confirm({
            message: options.message,
            header: options.title ?? 'Confirm',
            icon: options.icon ?? 'pi pi-exclamation-triangle',
            accept: options.accept,
            reject: options.reject,
        });
    }
}
