import {
    ChangeDetectionStrategy,
    Component,
    input,
    OnDestroy,
    OnInit,
    output,
} from '@angular/core';
import { AppSharedModule } from '../../../app-shared.module';
import { CardDto } from '../../http-clients/card-client.service';
import { SharedConstants } from '../../../core/constants';
import { Menu } from 'primeng/menu';

@Component({
    selector: 'app-personal-card',
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppSharedModule],
    standalone: true,
})
export class PersonalCardComponent implements OnInit, OnDestroy {
    model = input.required<CardDto>();
    menu = input<Menu>();
    onActionClick = output<CardDto>();

    constructor() {}

    ngOnInit() {}

    ngOnDestroy() {}

    logoImageUrl() {
        return `${SharedConstants.SERVER_BASE_URL}/storage/${this.model().logoImageUrl}`;
    }

    qrCodeImageUrl() {
        return `${SharedConstants.API_BASE_URL}/generate/qr-code?entity_type=card&entity_id=${this.model().id}`;
    }

    protected actionClick(e) {
        this.menu()?.toggle(e);
        this.onActionClick.emit(this.model());
    }
}
