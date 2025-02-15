import { computed, EventEmitter, inject, Injectable, signal } from '@angular/core';
import { FormState } from '../../../shared/interfaces';
import { RoleID } from '../../../shared/enums';
import { CreateOrUpdateRoleModule, RoleClientService, RoleForListDto } from '../../../shared/http-clients/role-client.service';
import { ModuleClientService, ModuleDto } from '../../../shared/http-clients/module-client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { AppConfirmationService } from '../../../shared/services/app-confirmation.service';
import { AuthService } from '../../../core/services/auth.service';
import {firstValueFrom} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private readonly fb = inject(FormBuilder);
    readonly toast = inject(AppToastService);
    readonly confirmation = inject(AppConfirmationService);
    readonly roleClient = inject(RoleClientService);
    readonly moduleClient = inject(ModuleClientService);
    readonly authService = inject(AuthService);

    formState = FormState.None;
    form: FormGroup;
    private blankFormData: any;

    roleDialogVisible = signal<boolean>(false);
    roleCreated = new EventEmitter<number>();
    roleUpdated = new EventEmitter<number>();
    roleDeleted = new EventEmitter<number>();

    modules: ModuleDto[] = [];

    constructor() {
        this.form = this.fb.group({
            id: null,
            name: null,
            permissions: null,
        });
        this.blankFormData = structuredClone(this.form.getRawValue());
    }

    showEditRoleDialog(role: RoleForListDto) {
        this.roleClient.getById(role.id)
            .subscribe(x => {
                this.resetForm(x, FormState.Update);
                this.roleDialogVisible.set(true);
            });
    }

    showCreateRoleDialog() {
        this.moduleClient.all().subscribe(modules => {
            this.modules = modules;
            this.resetForm(undefined, FormState.Create);
            this.roleDialogVisible.set(true);
        });
    }

    hideRoleDialog() {
        this.roleDialogVisible.set(false);
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

        const nameCtrl = this.form.get('name');
        const permissionsCtrl = this.form.get('permissions');

        nameCtrl.setValidators(Validators.required);
        permissionsCtrl.setValidators(Validators.required);

        if (this.formState === FormState.Update) {
            if (this.form.get('id').value === RoleID.Admin)
                nameCtrl.disable();
            else
                nameCtrl.enable();
        } else if (this.formState === FormState.Create) {
            permissionsCtrl.setValue(structuredClone(this.modules));
        }

    }

    validateForm(): boolean {
        Object.keys(this.form.controls).forEach(ctrlName => this.form.controls[ctrlName].markAsDirty());
        if (this.form.invalid)
            return false;

        return true;
    }

    saveRole() {
        if (!this.validateForm())
            return;

        const permissions = this.formData.permissions?.map(x => {
            return {
                id: x.id,
                allowView: x.allowView,
                allowCreate: x.allowCreate,
                allowUpdate: x.allowUpdate,
                allowDelete: x.allowDelete,
                extraPermissions: x.extraPermissions.filter(e => e.allowed === true).map(e => e.id)
            } as CreateOrUpdateRoleModule;
        });

        if (this.isNewEntity) {
            this.roleClient.createRole({
                name: this.formData.name,
                permissions: permissions
            }).subscribe({
                next: () => {
                    this.roleCreated.emit(this.formData.id);
                    this.toast.success('Role created successfully');
                    this.hideRoleDialog();
                }
            });
        } else {
            this.roleClient.updateRole({
                id: this.formData.id,
                name: this.formData.name,
                permissions: permissions
            }).subscribe({
                next: async () => {
                    this.toast.success('Role updated successfully');
                    this.hideRoleDialog();
                    if (this.authService.user.roles.includes(this.formData.id)) {
                        // refresh current user's stored permissions
                        await firstValueFrom(this.authService.reAuth());
                    }
                    this.roleUpdated.emit(this.formData.id);
                }
            });
        }
    }

    deleteRole(role: RoleForListDto) {
        this.confirmation.confirm({
            message: `Are you sure you want to delete role "${role.name}" ?`,
            accept: () => {
                this.roleClient.deleteRole(role.id).subscribe({
                    next: () => {
                        this.roleDeleted.emit(role.id);
                        this.toast.success('Role deleted successfully');
                        this.hideRoleDialog();
                    }
                });
            }
        });
    }
}
