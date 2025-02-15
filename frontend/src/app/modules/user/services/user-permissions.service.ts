import { inject, Injectable, signal } from '@angular/core';
import { FormState } from '../../../shared/interfaces';
import { UpdateUserModule, UpdateUserPermissionsDto, UserClientService, UserForListDto, UserModule } from '../../../shared/http-clients/user-client.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { AppConfirmationService } from '../../../shared/services/app-confirmation.service';
import { AuthService } from '../../../core/services/auth.service';
import {firstValueFrom} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserPermissionsService {
    private readonly fb = inject(FormBuilder);
    readonly userClient = inject(UserClientService);
    readonly toast = inject(AppToastService);
    readonly confirmation = inject(AppConfirmationService);
    readonly authService = inject(AuthService);

    formState = FormState.None;
    form: FormGroup;
    private blankFormData: any;

    userPermissionsDialogVisible = signal<boolean>(false);

    constructor() {
        this.form = this.fb.group({
            userId: null,
            permissions: null,
        });
        this.blankFormData = structuredClone(this.form.getRawValue());
    }

    showUserPermissionsDialog(user: UserForListDto) {
        this.userClient.permissions(user.id)
            .subscribe(x => {
                this.resetForm(x, FormState.Update);
                this.userPermissionsDialogVisible.set(true);
            });
    }

    hideUserPermissionsDialog() {
        this.userPermissionsDialogVisible.set(false);
        this.resetForm();
    }

    get formData() { return this.form.getRawValue(); }

    resetForm(data?: any, state?: FormState) {
        this.formState = state ?? FormState.None;

        Object.keys(this.form.controls).forEach(ctrlName => {
            this.form.controls[ctrlName].clearValidators();
            this.form.controls[ctrlName].enable();
        });

        this.form.reset(data ?? this.blankFormData);
    }

    validateForm(): boolean {
        Object.keys(this.form.controls).forEach(ctrlName => this.form.controls[ctrlName].markAsDirty());
        if (this.form.invalid)
            return false;

        return true;
    }

    save() {
        if (!this.validateForm())
            return;

        const dto = {
            userId: this.formData.userId,
            permissions: this.formData.permissions?.map(x => {
                return {
                    id: x.id,
                    allowView: x.allowView,
                    allowCreate: x.allowCreate,
                    allowUpdate: x.allowUpdate,
                    allowDelete: x.allowDelete,
                    extraPermissions: x.extraPermissions.filter(e => e.allowed === true).map(e => e.id)
                } as UpdateUserModule;
            })
        } as UpdateUserPermissionsDto;

        this.userClient.updatePermissions(dto).subscribe({
            next: async () => {
                this.hideUserPermissionsDialog();
                this.toast.success('User permissions updated successfully');
                if (dto.userId === this.authService.user.userId) {
                    // refresh current user's stored permissions
                    await firstValueFrom(this.authService.reAuth());
                }
            }
        });
    }

}
