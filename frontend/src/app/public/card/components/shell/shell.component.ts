import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    signal,
    ViewChild
} from '@angular/core';
import {AppSharedModule} from '../../../../app-shared.module';
import {MenuItem} from 'primeng/api';
import {CardClientService, CardDto} from '../../../../shared/http-clients/card-client.service';
import {AppToastService} from '../../../../shared/services/app-toast.service'
import {SubSink} from 'subsink';
import {PersonalCardComponent} from "../../../../shared/components/card/card.component";
import {ActivatedRoute} from "@angular/router";
import {CardNotAvailable} from "../../../../pages/card-not-available/card-not-available";
import {
    AppFloatingConfigurator
} from "../../../../layout/core/app-floating-configurator/app-floating-configurator.component";
import {NgxPrintService, PrintOptions} from "ngx-print";

@Component({
    selector: 'app-public-card',
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppSharedModule, AppFloatingConfigurator, PersonalCardComponent, CardNotAvailable, AppFloatingConfigurator],
    standalone: true
})
export class ShellComponent implements OnInit, OnDestroy {
    private readonly subs = new SubSink();
    readonly cardClient = inject(CardClientService);
    readonly toast = inject(AppToastService);
    readonly currentRoute = inject(ActivatedRoute);
    readonly printService = inject(NgxPrintService);
    @ViewChild('cardRef', {static: false}) cardRef: ElementRef;

    menuItems: MenuItem[] = [];

    card = signal<CardDto>(null);
    selectedCard?: CardDto;

    notAvailable = signal<boolean>(false);

    constructor() {
        this.currentRoute.queryParamMap.subscribe(params => {
            const cardId = params.has('id') ? Number.parseInt(params.get('id')?.trim()) : null;
            if (!cardId || Number.isNaN(cardId)) {
                this.notAvailable.set(true);
                return;
            }
            this.subs.sink = this.cardClient.publicGetById(cardId).subscribe({
                next: card => {
                    this.card.set(card);
                },
                error: () => {
                    this.notAvailable.set(true);
                }
            });
        });
    }

    ngOnInit() {
        this.menuItems = [
            {
                label: 'Print',
                command: () => {
                    const printOptions: PrintOptions = new PrintOptions({
                        printSectionId: 'printable-section',
                        printTitle: "Card Print",
                        openNewTab: false,
                        closeWindow: true,
                        useExistingCss: true,
                    });
                    this.printService.print(printOptions);
                }
            },
        ];
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    onActionsBtnClick(e) {
        this.selectedCard = e;
    }

    onPrintClick() {
        const printOptions: PrintOptions = new PrintOptions({
            printSectionId: 'printable-section',
            printTitle: "Card Print",
            openNewTab: false,
            closeWindow: true,
            useExistingCss: true,
        });
        this.printService.print(printOptions);
    }

    onExportClick() {
       //  //replacing html2canvas with html2canvas-pro
       //  window['html2canvas'] = html2canvas;
       //
       //  const pdf = new jsPDF({
       //      unit: 'px',
       //      orientation: 'landscape',
       //      format: 'a5',
       //  });
       //
       //  pdf.html(document.getElementById('printable-section'), {
       //      callback: function () {
       //          // pdf.save('test.pdf');
       //          window.open(pdf.output('bloburl'));
       //      },
       //     // html2canvas : { allowTaint: true, useCORS: true, logging: true }
       //  });
       //
       // // pdf.save('test.pdf');
    }

}
