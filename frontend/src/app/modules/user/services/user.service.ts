import { EventEmitter, inject, Injectable, signal } from '@angular/core';
import { FormState } from '../../../shared/interfaces';
import { UserClientService, UserForListDto } from '../../../shared/http-clients/user-client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { AppConfirmationService } from '../../../shared/services/app-confirmation.service';
import { RoleClientService } from '../../../shared/http-clients/role-client.service';
import { AuthService } from '../../../core/services/auth.service';
import {ExtraPermission} from "../../../core/constants";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly fb = inject(FormBuilder);
    readonly userClient = inject(UserClientService);
    readonly roleClient = inject(RoleClientService);
    readonly toast = inject(AppToastService);
    readonly confirmation = inject(AppConfirmationService);
    readonly authService = inject(AuthService);

    formState = FormState.None;
    form: FormGroup;
    private blankFormData: any;

    userDialogVisible = signal<boolean>(false);
    userCreated = new EventEmitter<number>();
    userUpdated = new EventEmitter<number>();
    userDeleted = new EventEmitter<number>();

    canAssignRoles = false;
    canChangeSecurityLevel = false;

    constructor() {
        this.form = this.fb.group({
            id: null,
            username: null,
            email: null,
            password: null,
            roles: null,
            securityLevel: null,
        });
        this.blankFormData = structuredClone(this.form.getRawValue());
        this.authService.onTokenRefresh.subscribe(x => {
            this._checkExtraPermissions();
        })
        this._checkExtraPermissions();
    }

    _checkExtraPermissions() {
        this.canAssignRoles = this.authService.hasExtraPermission(ExtraPermission.Assign_roles);
        this.canChangeSecurityLevel = this.authService.hasExtraPermission(ExtraPermission.Change_security_level);
    }

    showEditUserDialog(user: UserForListDto) {
        this.userClient.getById(user.id)
            .subscribe(x => {
                this.resetForm(x, FormState.Update);
                this.userDialogVisible.set(true);
            });
    }

    showCreateUserDialog() {
        this.resetForm(undefined, FormState.Create);
        this.userDialogVisible.set(true);
    }

    hideUserDialog() {
        this.userDialogVisible.set(false);
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

        const usernameCtrl = this.form.get('username');
        usernameCtrl.setValidators(Validators.required);
        this.form.get('email').setValidators(Validators.required);
        this.form.get('roles').setValidators(Validators.required);
        this.form.get('securityLevel').setValidators(Validators.required);

        if (this.formState === FormState.Create) {
            this.form.get('password').setValidators(Validators.required);
            this.form.get('roles').setValue([2]); // normal user
            this.form.get('securityLevel').setValue(1); // lowest security level
        } else if (this.formState === FormState.Update) {
            if (usernameCtrl.value === 'admin')
                usernameCtrl.disable();
            else
                usernameCtrl.enable();
        }

        if(!this.canAssignRoles)
            this.form.controls['roles'].disable();
        else
            this.form.controls['roles'].enable();

        if(!this.canChangeSecurityLevel)
            this.form.controls['securityLevel'].disable();
        else
            this.form.controls['securityLevel'].enable();
    }

    validateForm(): boolean {
        Object.keys(this.form.controls).forEach(ctrlName => this.form.controls[ctrlName].markAsDirty());
        if (this.form.invalid)
            return false;

        return true;
    }

    saveUser() {
        if (!this.validateForm())
            return;
        if (this.isNewEntity) {
            this.userClient.createUser(this.formData).subscribe({
                next: () => {
                    this.userCreated.emit(this.formData.id);
                    this.toast.success('User created successfully');
                    this.hideUserDialog();
                }
            });
        } else {
            this.userClient.updateUser(this.formData).subscribe({
                next: () => {
                    this.userUpdated.emit(this.formData.id);
                    this.toast.success('User updated successfully');
                    if (this.formData.id === this.authService.user.userId) {
                        // refresh current user's stored permissions
                        this.authService.doRefreshToken().subscribe();
                    }
                    this.hideUserDialog();
                }
            });
        }
    }

    deleteUser(user: UserForListDto) {
        this.confirmation.confirm({
            message: `Are you sure you want to delete user "${user.username}" ?`,
            accept: () => {
                this.userClient.deleteUser(user.id).subscribe({
                    next: () => {
                        this.userDeleted.emit(user.id);
                        this.toast.success('User deleted successfully');
                        this.hideUserDialog();
                    }
                });
            }
        });
    }
}
