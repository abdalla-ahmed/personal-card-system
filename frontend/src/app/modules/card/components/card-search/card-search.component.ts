import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Menu } from 'primeng/menu';
import { CardService } from '../../services/card.service';
import { CardClientService, CardForListDto } from '../../../../shared/http-clients/card-client.service';
import { AppToastService } from '../../../../shared/services/app-toast.service'
import { SubSink } from 'subsink';
import { CardDialogComponent } from '../card-dialog/card-dialog.component';
import { SharedConstants } from '../../../../core/common/constants';

@Component({
    selector: 'app-card-search',
    templateUrl: './card-search.component.html',
    styleUrl: './card-search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppSharedModule, CardDialogComponent],
})
export class CardSearchComponent implements OnInit, OnDestroy {
    private readonly subs = new SubSink();

    readonly cardService = inject(CardService);
    readonly cardClient = inject(CardClientService);
    readonly toast = inject(AppToastService);
    readonly currentRoute = inject(ActivatedRoute);

    @ViewChild('rowMenu') rowMenu!: Menu;

    rowActions: MenuItem[] = [];

    cards = signal<CardForListDto[]>([]);
    selectedCard?: CardForListDto;

    logoImageUrl(card: CardForListDto) {
        return `${SharedConstants.SERVER_BASE_URL}/storage/${card.logoImageUrl}`;
    }

    qrCodeImageUrl(card: CardForListDto) {
        return `${SharedConstants.API_BASE_URL}/qr-code?entity_type=card&entity_id=${card.id}`;
    }

    get form() { return this.cardService.form; }

    constructor() {
        this.subs.sink = this.cardService.cardCreated
            .subscribe(cardId => {
                this.getAllCards();
            });
        this.subs.sink = this.cardService.cardUpdated
            .subscribe(cardId => {
                this.getAllCards();
            });
        this.subs.sink = this.cardService.cardDeleted
            .subscribe(cardId => {
                this.getAllCards();
            });
    }

    ngOnInit() {
        this.rowActions = [
            {
                label: 'Edit',
                command: (e) => { this.cardService.showEditCardDialog(this.selectedCard); }
            },
            {
                label: 'Delete',
                command: (e) => { this.cardService.deleteCard(this.selectedCard); }
            },
        ];

        this.getAllCards();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    private getAllCards() {
        this.subs.sink = this.cardClient.all()
            .subscribe(cards => {
                this.cards.set(cards);
            });
    }

    onActionsBtnClick(e: any, rowData: any) {
        this.selectedCard = rowData;
        this.rowMenu.toggle(e);
    }
}
