import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppSharedModule } from '../../../../app-shared.module';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppFloatingConfigurator } from '../../../../layout/core/app-floating-configurator/app-floating-configurator.component';
import { AppToastService } from '../../../../shared/services/app-toast.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [AppSharedModule, AppFloatingConfigurator]
})
export class LoginComponent implements OnInit, OnDestroy {
    subs = new SubSink;
    form: FormGroup;

    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly toast = inject(AppToastService);

    constructor() {
        this.form = this.fb.group({
            username: [null, [Validators.required]],
            password: [null, [Validators.required]],
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
        this.subs.sink = this.authService.login(this.form.value.username, this.form.value.password).subscribe({
            next: user => {
                this.router.navigate(['/']);
            }
        });
    }
}
