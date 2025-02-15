import { ChangeDetectionStrategy, Component, inject, model, OnInit } from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { CardService } from '../../services/card.service';
import { PrimeNG } from 'primeng/config';

@Component({
    selector: 'app-card-dialog',
    templateUrl: './card-dialog.component.html',
    styleUrls: ['./card-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [AppSharedModule],
})
export class CardDialogComponent implements OnInit {
    visible = model.required<boolean>();
    readonly cardService = inject(CardService);

    constructor() {}

    ngOnInit() {}

    get form() {
        return this.cardService.form;
    }

    get canChangeCardState() {
        return this.cardService.authService.isAdmin;
    }
}
