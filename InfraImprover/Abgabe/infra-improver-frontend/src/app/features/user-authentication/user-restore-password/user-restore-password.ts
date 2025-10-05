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

import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/supabase-service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IftaLabel } from 'primeng/iftalabel';
import { ToastService } from '../../../core/toast-service';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FocusTrap } from 'primeng/focustrap';
import { AutoFocus } from 'primeng/autofocus';
import { Tooltip } from 'primeng/tooltip';
import { Message } from 'primeng/message';

@Component({
  selector: 'ii-restore-password',
  templateUrl: './user-restore-password.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputText,
    PasswordModule,
    IftaLabel,
    IconField,
    InputIcon,
    FocusTrap,
    AutoFocus,
    Tooltip,
    Message,
  ],
})
export default class UserRestorePassword {
  private _supabaseService: SupabaseService = inject(SupabaseService);
  private _router: Router = inject(Router);
  private _toaster: ToastService = inject(ToastService);

  protected validationFailed = signal(false);
  protected isPasswordRestoring = signal(false);

  protected restoreForm: FormGroup = new FormGroup({
    email: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email]),
  });

  protected async onRestorePassword() {
    if (this.restoreForm.invalid) {
      this.validationFailed.set(true);
      console.warn('Password restore failed, since form was invalid.');
      return;
    }
    this.validationFailed.set(false);
    this.isPasswordRestoring.set(true);
    this.restoreForm.controls['email']?.disable();
    const { email } = this.restoreForm.value;
    const { error } = await this._supabaseService.restoreUserPassword(email);
    this.restoreForm.controls['email'].enable();

    if (error) {
      this._toaster.showWarning(error.message);
    } else {
      this._toaster.showSuccess('Passwort zurücksetzen erfolgreich! Eine E-Mail wurde versendet.');
    }
    this.isPasswordRestoring.set(false);
  }
  protected async onAbort() {
    await this._router.navigate(['/login']);
  }
}
