import { EventEmitter, inject, Injectable, signal } from '@angular/core';
import { FormState } from '../../../shared/interfaces';
import { CardClientService, CardForListDto } from '../../../shared/http-clients/card-client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { AppConfirmationService } from '../../../shared/services/app-confirmation.service';
import { FileSelectEvent } from 'primeng/fileupload';
import {AuthService} from "../../../core/services/auth.service";
import {ElementPrinterService, PrintOptions} from "../../../shared/services/element-printer.service";

@Injectable({
    providedIn: 'root'
})
export class CardService {
    private readonly fb = inject(FormBuilder);
    readonly toast = inject(AppToastService);
    readonly confirmation = inject(AppConfirmationService);
    readonly cardClient = inject(CardClientService);
    readonly authService = inject(AuthService);
    readonly elementPrinterService = inject(ElementPrinterService);

    formState = FormState.None;
    form: FormGroup;
    private blankFormData: any;

    cardDialogVisible = signal<boolean>(false);
    cardCreated = new EventEmitter<number>();
    cardUpdated = new EventEmitter<number>();
    cardDeleted = new EventEmitter<number>();

    selectedLogoFile: File = null;

    constructor() {
        this.form = this.fb.group({
            id: null,
            fullName: null,
            position: null,
            telephone: null,
            mobile: null,
            email: null,
            address: null,
            companyName: null,
            companyAddress: null,
            active: null,
        });
        this.blankFormData = structuredClone(this.form.getRawValue());
    }

    showEditCardDialog(card: CardForListDto) {
        this.cardClient.getById(card.id)
            .subscribe(x => {
                this.resetForm(x, FormState.Update);
                this.cardDialogVisible.set(true);
            });
    }

    showCreateCardDialog() {
        this.resetForm(undefined, FormState.Create);
        this.cardDialogVisible.set(true);
    }

    hideCardDialog() {
        this.cardDialogVisible.set(false);
        this.resetForm();
    }

    get isNewEntity() { return !this.form.value.id; }
    get isCreate() { return this.formState === FormState.Create; }
    get isUpdate() { return this.formState === FormState.Update; }

    get formData() { return this.form.getRawValue(); }

    resetForm(data?: any, state?: FormState) {
        this.formState = state ?? FormState.None;

        Object.keys(this.form.controls).forEach(ctrlName => {
            this.form.controls[ctrlName].clearValidators();
            this.form.controls[ctrlName].enable();
        });

        this.form.reset(data ?? this.blankFormData);

        Object.keys(this.form.controls).forEach(ctrlName => {
            if (ctrlName == 'id' || ctrlName == 'active')
                return;
            this.form.controls[ctrlName].setValidators(Validators.required);
        });


        if (this.formState === FormState.Update) {
        } else if (this.formState === FormState.Create) {
        }

        this.selectedLogoFile = null;
    }

    validateForm(): boolean {
        Object.keys(this.form.controls).forEach(ctrlName => this.form.controls[ctrlName].markAsDirty());
        if (this.form.invalid)
            return false;

        return true;
    }

    saveCard() {
        if (!this.validateForm())
            return;

        if (this.isNewEntity) {
            this.cardClient.createCard(this.formData, this.selectedLogoFile).subscribe({
                next: () => {
                    this.cardCreated.emit(this.formData.id);
                    this.toast.success('Card created successfully');
                    this.hideCardDialog();
                }
            });
        } else {
            this.cardClient.updateCard(this.formData, this.selectedLogoFile).subscribe({
                next: () => {
                    this.cardUpdated.emit(this.formData.id);
                    this.toast.success('Card updated successfully');
                    this.hideCardDialog();
                }
            });
        }
    }

    deleteCard(card: CardForListDto) {
        this.confirmation.confirm({
            message: `Are you sure you want to delete card "${card.fullName}" ?`,
            accept: () => {
                this.cardClient.deleteCard(card.id).subscribe({
                    next: () => {
                        this.cardDeleted.emit(card.id);
                        this.toast.success('Card deleted successfully');
                        this.hideCardDialog();
                    }
                });
            }
        });
    }

    toggleCardState() {
        this.confirmation.confirm({
            message: `Are you sure you want to ${this.formData.active ? 'deactivate' : 'reactivate'} the card ?`,
            accept: () => {
                this.cardClient.updateState({
                    id: this.formData.id,
                    active: !this.formData.active // reverse
                }).subscribe({
                    next: () => {
                        this.cardUpdated.emit(this.formData.id);
                        this.toast.success(`Card ${this.formData.active ? 'deactivated' : 'reactivated'} successfully`);
                        this.hideCardDialog();
                    }
                });
            }
        });
    }

    onLogoFileSelected(e: FileSelectEvent) {
        this.selectedLogoFile = e.files[0];
    }

    printCard(elementId: string) {
        const printOptions = new PrintOptions({
            printSectionId: elementId,
            printTitle: "Card Print",
            openNewTab: false,
            closeWindow: true,
            useExistingCss: true,
            hideElementsById: ['#card-btn-actions-menu-container'],
           // bodyClass: 'flex m-5',
            //htmlClass: 'app-dark',
        });
        this.elementPrinterService.print(printOptions);
    }
}
