import { Component } from '@angular/core';
import {AppSharedModule} from "../../app-shared.module";

@Component({
    selector: 'app-card-not-available',
    standalone: true,
    imports: [AppSharedModule],
    template: `
        <div class="flex items-center justify-center min-h-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, color-mix(in srgb, var(--primary-color), transparent 60%) 10%, var(--surface-ground) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                        <span class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-3xl mb-2">Card is not available</span>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class CardNotAvailable {}
