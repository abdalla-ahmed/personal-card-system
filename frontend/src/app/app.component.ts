import { Component, OnInit } from '@angular/core';
import { AppSharedModule } from './app-shared.module';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    imports: [AppSharedModule]
})
export class AppComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }
}
