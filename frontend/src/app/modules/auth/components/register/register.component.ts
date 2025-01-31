import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { AppToastService } from '../../../../shared/services/app-toast.service';
import { AppFloatingConfigurator } from '../../../../layout/core/app-floating-configurator/app-floating-configurator.component';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [AppSharedModule, AppFloatingConfigurator]
})
export class RegisterComponent implements OnInit, OnDestroy {
    subs = new SubSink;
    form: FormGroup;

    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly toast = inject(AppToastService);

    constructor() {
        this.form = this.fb.group({
            username: [null, [Validators.required]],
            email: [null, [Validators.required]],
            password: [null, [Validators.required]],
            passwordConfirmation: [null, [Validators.required]],
        });
    }

    ngOnInit(): void { }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    onSubmit() {
        Object.keys(this.form.controls).forEach(ctrlName => this.form.controls[ctrlName].markAsDirty());
        if (!this.form.valid)
            return;
        this.subs.sink = this.authService.registerUser(
            this.form.value.username,
            this.form.value.email,
            this.form.value.password,
            this.form.value.passwordConfirmation).subscribe({
                next: user => {
                    this.toast.success('Account created successfully.');
                    this.router.navigate(['/']);
                }
            });
    }

}
