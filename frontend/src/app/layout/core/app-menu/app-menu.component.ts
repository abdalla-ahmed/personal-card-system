import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../app-menuitem/app-menuitem.component';
import { AuthService } from '../../../core/services/auth.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    templateUrl: './app-menu.component.html'
})
export class AppMenu implements OnInit, OnDestroy {
    private subs = new SubSink;
    readonly authService = inject(AuthService);

    menuItems: MenuItem[] = [];

    constructor() {
        this.menuItems = [
            {
                moduleId: null,
                label: 'Main',
                items: [
                    { moduleId: null, label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/internal/dashboard'] },
                    { moduleId: 4, label: 'Cards', icon: 'pi pi-fw pi-id-card', routerLink: ['/internal/cards'] },
                ]
            },
            {
                moduleId: null,
                label: 'Administration',
                items: [
                    { moduleId: 3, label: 'Users', icon: 'pi pi-fw pi-users', routerLink: ['/internal/users'] },
                    { moduleId: 2, label: 'Roles', icon: 'pi pi-fw pi-list-check', routerLink: ['/internal/roles'] },
                    { moduleId: 1, label: 'Activity Log', icon: 'pi pi-fw pi-book', routerLink: ['/internal/activity-log'] },
                ]
            },
        ];
    }

    ngOnInit() {
        this.subs.sink = this.authService.onTokenRefresh.subscribe(user => {
            this.refreshMenuVisibility();
        });

        this.subs.sink = this.authService.onUserLoggedIn.subscribe(user => {
            this.refreshMenuVisibility();
        });

        this.refreshMenuVisibility();
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    /**
     * recusion function traverses over the menu items
     * resetting the visibility for each item.
     * everything is visible to the default admin user regardless of the given permission.
     * @param item menu item/node
     * @param visible if not set or null, the reset will be based on each item's module permission for current user.
     */
    private resethMenuItemVisibility(item: MenuItem, visible?: boolean) {
        if (visible != null) {
            item.visible = visible;
        } else {
            if (this.authService.hasUser) {
                if (this.authService.isSuperAdmin) {
                    item.visible = true;
                } else {
                    const moduleId = item['moduleId'];
                    item.visible = !moduleId || this.authService
                        .user?.permissions.some(x =>
                            x.moduleId === moduleId
                            && x.allowView === true
                        );
                }
            } else {
                item.visible = false;
            }
        }

        if (item.items?.length) {
            for (const child of item.items) {
                this.resethMenuItemVisibility(child);
            }
            item.visible = item.items.some(x => x.visible === true);
        }
    }

    private refreshMenuVisibility() {
        this.menuItems.forEach(item => {
            this.resethMenuItemVisibility(item);
        })
    }

}
