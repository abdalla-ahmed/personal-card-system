import { inject, Injectable } from '@angular/core';
import { FormState } from '../../../shared/interfaces';
import { UserClientService } from '../../../shared/http-clients/user-client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserProfileService {
    private readonly fb = inject(FormBuilder);
    readonly userClient = inject(UserClientService);
    readonly toast = inject(AppToastService);
    readonly authService = inject(AuthService);

    formState = FormState.None;
    form: FormGroup;
    private blankFormData: any;

    constructor() {
        this.form = this.fb.group({
            username: null,
            email: null,
            password: null,
        });
        this.blankFormData = structuredClone(this.form.getRawValue());
    }

    loadProfile() {
        this.userClient.currentUserProfile().subscribe((x) => {
            this.resetForm(x, FormState.Update);
        });
    }

    get isNewEntity() {
        return !this.form.value.id;
    }

    get isCreate() {
        return this.formState === FormState.Create;
    }

    get isUpdate() {
        return this.formState === FormState.Update;
    }

    get formData() {
        return this.form.getRawValue();
    }

    resetForm(data?: any, state?: FormState) {
        this.formState = state ?? FormState.None;

        Object.keys(this.form.controls).forEach((ctrlName) => {
            this.form.controls[ctrlName].clearValidators();
            this.form.controls[ctrlName].enable();
        });

        this.form.reset(data ?? this.blankFormData);

        const usernameCtrl = this.form.get('username');
        usernameCtrl.setValidators(Validators.required);
        this.form.get('email').setValidators(Validators.required);

        if (this.formState === FormState.Update) {
            if (usernameCtrl.value === 'admin') usernameCtrl.disable();
            else usernameCtrl.enable();
        }
    }

    validateForm(): boolean {
        Object.keys(this.form.controls).forEach((ctrlName) =>
            this.form.controls[ctrlName].markAsDirty(),
        );
        if (this.form.invalid) return false;

        return true;
    }

    save() {
        if (!this.validateForm()) return;
        this.userClient.updateCurrentUserProfile(this.formData).subscribe({
            next: async () => {
                this.toast.success('Profile updated successfully');
                // we should refresh the token.
                await firstValueFrom(this.authService.reAuth());
            },
        });
    }
}
