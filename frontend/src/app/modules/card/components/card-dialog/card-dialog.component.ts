import { ChangeDetectionStrategy, Component, inject, input, model, OnInit } from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { CardService } from '../../services/card.service';
import {CardDto} from '../../../../shared/http-clients/card-client.service';
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
    readonly primeng = inject(PrimeNG);

    constructor() {}

    ngOnInit() {}

    get form() {
        return this.cardService.form;
    }
}
