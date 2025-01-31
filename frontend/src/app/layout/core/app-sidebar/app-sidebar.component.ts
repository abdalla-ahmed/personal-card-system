import { Component, ElementRef } from '@angular/core';
import { AppMenu } from '../app-menu/app-menu.component';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    templateUrl: './app-sidebar.component.html'
})
export class AppSidebar {
    constructor(public el: ElementRef) { }
}
