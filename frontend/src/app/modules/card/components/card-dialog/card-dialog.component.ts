import { ChangeDetectionStrategy, Component, inject, input, model, OnInit } from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { CardService } from '../../services/card.service';
import { CardForListDto } from '../../../../shared/http-clients/card-client.service';
import { PrimeNG } from 'primeng/config';
import { FileSelectEvent } from 'primeng/fileupload';

@Component({
    selector: 'app-card-dialog',
    templateUrl: './card-dialog.component.html',
    styleUrls: ['./card-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppSharedModule]
})
export class CardDialogComponent implements OnInit {
    visible = model.required<boolean>();
    card = input.required<CardForListDto>();

    readonly cardService = inject(CardService);
    readonly primeng = inject(PrimeNG);

    constructor() { }

    ngOnInit() { }

    get form() { return this.cardService.form; }
}
