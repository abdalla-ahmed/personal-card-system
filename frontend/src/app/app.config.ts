import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, TitleStrategy, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withRouterConfig, withViewTransitions } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { AppTitleService } from './core/services/app-title.service';
import { ServerRequestInterceptor, ServerResponseInterceptor } from './core/interceptors';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes,
            withRouterConfig({ onSameUrlNavigation: 'reload', }),
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
            withEnabledBlockingInitialNavigation(),
            withViewTransitions(),
            //withHashLocation(),
            //withDebugTracing()
        ),
        { provide: TitleStrategy, useClass: AppTitleService },
        //provideHttpClient(withFetch()),
        provideHttpClient(withInterceptors([ServerRequestInterceptor, ServerResponseInterceptor])),
        provideAnimationsAsync(),
        providePrimeNG({
            ripple: true,
            inputStyle: 'outlined',
            theme: {
                preset: Aura,
                options: { darkModeSelector: '.app-dark' }
            },
        }),
        MessageService,
        ConfirmationService
    ]
};
