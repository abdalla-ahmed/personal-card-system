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
import {isNumber} from "chart.js/helpers";

// Generate an unique id for your element
// From https://stackoverflow.com/a/2117523/2054072
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Flatten an array
// https://stackoverflow.com/a/15030117/2054072
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

function recursiveExtract(element) {
    const id = uuidv4()
    const oldId = element.id

   const getComputedCssText = (element) => {
        const computedStyles = window.getComputedStyle(element);
        let cssText = "";
        for (let i = 0; i < computedStyles.length; i++) {
            const propertyName = computedStyles[i];
            const propertyValue = computedStyles.getPropertyValue(propertyName);
            cssText += `${propertyName}: ${propertyValue};\n`;
        }
        return cssText;
    }

    const computedCssText = getComputedCssText(element);
    const style = computedCssText;


    // Now that we get the style, we can swap the id
    element.setAttribute('id', id)

    // The children are not a real array but a NodeList, we need to convert them
    // so we can map over them easily
    const children = Array.prototype.slice.call(element.children)
    return [{id: id, style: style, oldId: oldId}].concat(children.map(recursiveExtract))
}

function extractCSS(element) {
    if (!element) {
        return {elements: [], stylesheet: ''}
    }

    var raw = recursiveExtract(element)
    var flat = flatten(raw)

    return {
        elements: flat,
        stylesheet: flat.reduce(function (acc, cur) {
            var style = '#' + cur.id + ' {\n' + cur.style + '\n}\n\n'
            return acc + style
        }, '')
    }
}

async function convertImagesToBase64(container) {
    const imgElements = container.querySelectorAll("img");

    for (let img of imgElements) {
        if (img.src.startsWith("data:")) continue; // Skip images already in base64

        try {
            const response = await fetch(img.src);
            const blob = await response.blob();

            const reader = new FileReader();
            reader.readAsDataURL(blob);

            await new Promise(resolve => {
                reader.onloadend = () => {
                    img.src = reader.result; // Replace src with base64 string
                    resolve(reader.result);
                };
            });
        } catch (error) {
            console.error("Error converting image to base64:", error);
        }
    }
}



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
    @ViewChild('cardRef', {static: true}) cardRef: ElementRef;

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
       // debugger
        const element = document.querySelector('app-personal-card');
        const res = extractCSS(element);

      //  console.log(res.stylesheet);

        // function swapBackIds(elements) {
        //     elements.forEach(function (e) {
        //         const element = document.getElementById(e.id);
        //         element.setAttribute('id', e.oldId);
        //     })
        // }
        //
        // swapBackIds(res.elements)


       // return;
        convertImagesToBase64(element)
        let html =  element.outerHTML;

        html = `<html>\n<head>\n<style type="text/css">${res.stylesheet}</style>\n</head>\n<body>\n${html}\n</body>\n</html>\n`;

        console.log(html);

        this.cardClient.generatePdf(btoa(html)).subscribe(res => {
            debugger
            this.toast.info('Card downloaded');
            //window.open("data:application/pdf;base64," + res);
            // const blob = new Blob([res], {type: 'application/pdf;base64'});
            // const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = 'data:application/pdf;base64,' + res;
            a.download = 'document.pdf';
            a.click();
            //window.URL.revokeObjectURL(url);
        });
    }

    // onExportClick() {
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
    //}

}
