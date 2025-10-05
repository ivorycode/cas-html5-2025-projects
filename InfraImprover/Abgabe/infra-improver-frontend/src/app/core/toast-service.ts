/*
_____          __                       _____
|_   _|        / _|                     |_   _|
 | |   _ __  | |_  _ __   __ _  ______   | |   _ __ ___   _ __   _ __   ___  __   __  ___  _ __
 | |  | '_ \ |  _|| '__| / _` ||______|  | |  | '_ ` _ \ | '_ \ | '__| / _ \ \ \ / / / _ \| '__|
 | |_ | | | || |  | |   | (_| |         _| |_ | | | | | || |_) || |   | (_) | \ V / |  __/| |
 \___/ |_| |_||_|  |_|    \__,_|         \___/ |_| |_| |_|| .__/ |_|    \___/   \_/   \___||_|
                                                          | |
                                                          |_|
  Copyright @Beat Weisskopf, Sandrine Ngo-Dinh, Yves Jegge
*/

import { inject, Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _messageService: MessageService = inject(MessageService);

  public showSuccess(message: string) {
    console.log(`User success message: ${message}`);
    this._messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000,
    });
  }

  public showInfo(message: string) {
    console.log(`User info message: ${message}`);
    this._messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
      life: 3000,
    });
  }

  public showWarning(message: string) {
    console.warn(`User waring message: ${message}`);
    this._messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: message,
      life: 3000,
    });
  }

  public showError(message: string) {
    console.error(`User error message: ${message}`);
    this._messageService.add({
      sticky: true,
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 4000,
    });
  }
}
