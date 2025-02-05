import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/core/app-floating-configurator/app-floating-configurator.component';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, AppFloatingConfigurator, ButtonModule],
    template: ` <app-floating-configurator />
        <div class="flex items-center justify-center min-h-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
            <svg class="mb-8 w-16 shrink-0 mx-auto" version="1.1" id="Layer_1" fill="var(--primary-color)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 511.999 511.999" xml:space="preserve">
                        <rect x="107.045" y="228.668" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 206.4423 737.6942)" style="fill:#7A7674;" width="297.915" height="194.848"/>
                        <rect x="107.041" y="158.574" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 255.998 618.0337)" style="fill:#CCC4C1;" width="297.915" height="194.848"/>
                        <rect x="107.036" y="88.469" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 305.5619 498.3532)" style="fill:#EBEDEC;" width="297.915" height="194.848"/>
                        <path d="M428.213,344.012c-4.563-4.562-11.961-4.562-16.523,0s-4.562,11.96,0,16.522l2.005,2.004L292.44,483.793L98.303,289.656
                            l2.005-2.005c4.562-4.562,4.562-11.96,0-16.522c-4.562-4.562-11.96-4.562-16.522,0l-10.266,10.266
                            c-4.562,4.562-4.562,11.96,0,16.522l210.659,210.659c2.282,2.282,5.271,3.422,8.261,3.422s5.979-1.14,8.261-3.422L438.479,370.8
                            c2.191-2.191,3.422-5.163,3.422-8.261c0-3.098-1.231-6.071-3.422-8.261L428.213,344.012z"/>
                        <path d="M428.213,273.913c-4.563-4.562-11.961-4.562-16.523,0s-4.562,11.96,0,16.522l2.005,2.004L292.44,413.695L98.303,219.558
                            l2.005-2.005c4.562-4.562,4.562-11.96,0-16.522c-4.562-4.562-11.96-4.562-16.522,0l-10.266,10.266
                            c-4.562,4.562-4.562,11.96,0,16.522l210.659,210.659c2.282,2.282,5.271,3.422,8.261,3.422s5.979-1.14,8.261-3.422l137.778-137.777
                            c2.191-2.191,3.422-5.163,3.422-8.261c0-3.098-1.231-6.071-3.422-8.261L428.213,273.913z"/>
                        <path d="M284.179,368.381c2.282,2.282,5.271,3.422,8.261,3.422s5.979-1.14,8.261-3.422l137.778-137.777
                            c2.191-2.191,3.422-5.163,3.422-8.261c0-3.098-1.231-6.071-3.422-8.261L227.818,3.422c-4.561-4.562-11.96-4.562-16.522,0
                            L73.519,141.199c-4.562,4.562-4.562,11.96,0,16.523L284.179,368.381z M219.557,28.205l194.137,194.137L292.44,343.597L98.303,149.46
                            L219.557,28.205z"/>
                        <path d="M300.193,224.827c6.449-0.232,11.488-5.646,11.255-12.095l-1.233-34.276c-0.22-6.123-5.132-11.036-11.255-11.255
                            l-23.414-0.842l-0.844-23.415c-0.22-6.122-5.132-11.035-11.254-11.255l-34.28-1.235c-6.442-0.235-11.864,4.806-12.097,11.255
                            c-0.232,6.448,4.806,11.863,11.255,12.097l23.416,0.844l0.844,23.416c0.221,6.123,5.134,11.035,11.255,11.255l23.413,0.842
                            l0.842,23.412c0.225,6.305,5.409,11.264,11.667,11.264C299.908,224.835,300.05,224.833,300.193,224.827z"/>
                        <path d="M212.225,158.65c-4.563-4.561-11.96-4.561-16.522,0c-4.562,4.562-4.563,11.96,0,16.523l71.024,71.025
                            c2.282,2.282,5.271,3.422,8.261,3.422s5.981-1.141,8.261-3.422c4.562-4.562,4.562-11.96,0-16.523L212.225,158.65z"/>
                    </svg>

                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, color-mix(in srgb, var(--primary-color), transparent 60%) 10%, var(--surface-ground) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                        <span class="text-primary font-bold text-5xl mb-4">404</span>
                        <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-5xl mb-2">Not Found</h1>
                        <div class="text-surface-600 dark:text-surface-200 mb-8">The requested resource is not available.</div>
                        <div class="mt-8"><p-button label="Go to Main" routerLink="/" /></div>
                    </div>
                </div>
            </div>
        </div>`
})
export class Notfound {}
