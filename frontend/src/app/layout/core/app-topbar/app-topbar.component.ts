import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../../core/services/layout.service';
import { AppConfigurator } from '../app-configurator/app-configurator.component';
import { AppSharedModule } from '../../../app-shared.module';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [AppSharedModule, AppConfigurator],
    templateUrl: './app-topbar.component.html'
})
export class AppTopbar implements OnInit {
    readonly authService = inject(AuthService);
    readonly user = this.authService.user!;
    readonly router = inject(Router);

    items: MenuItem[] | undefined;

    constructor(public layoutService: LayoutService) { }

    ngOnInit(): void {
        this.items = [
            {
                separator: true
            },
            {
                label: 'Profile',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-cog',
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        command: (e) => {
                            this.authService.logout().subscribe(() => {
                                this.router.navigate(['/auth']);
                            });
                        }
                    }
                ]
            }
        ];
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
