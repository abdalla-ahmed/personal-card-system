import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class AppToastService {
    readonly messageService = inject(MessageService);

    private readonly key = 'main';
    private readonly life = 5000;

    constructor() { }

    show(message: string, title: string) {
        this.secondary(message, title);
    }

    success(message: string, title?: string) {
        this.messageService.add({ severity: 'success', summary: title ?? 'Success', detail: message, key: this.key, life: this.life });
    }

    info(message: string, title?: string) {
        this.messageService.add({ severity: 'info', summary: title ?? 'Info', detail: message, key: this.key, life: this.life });
    }

    warning(message: string, title?: string) {
        this.messageService.add({ severity: 'warn', summary: title ?? 'Warning', detail: message, key: this.key, life: this.life });
    }

    error(message: string, title?: string) {
        this.messageService.add({ severity: 'error', summary: title ?? 'Error', detail: message, key: this.key, life: this.life });
    }

    contrast(message: string, title: string) {
        this.messageService.add({ severity: 'contrast', summary: title, detail: message, key: this.key, life: this.life });
    }

    secondary(message: string, title: string) {
        this.messageService.add({ severity: 'secondary', summary: title, detail: message, key: this.key, life: this.life });
    }

}
