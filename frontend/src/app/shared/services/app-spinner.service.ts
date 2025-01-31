import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class AppSpinnerService {
  private readonly spinnerService = inject(NgxSpinnerService);

  constructor() {
  }

  show() {
    return this.spinnerService.show();
  }

  hide() {
    return this.spinnerService.hide();
  }

}
