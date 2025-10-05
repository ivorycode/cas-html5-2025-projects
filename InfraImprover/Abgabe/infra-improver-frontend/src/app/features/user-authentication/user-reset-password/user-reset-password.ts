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
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../core/toast-service';
import { SupabaseService } from '../../../core/supabase-service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FocusTrap } from 'primeng/focustrap';
import { Tooltip } from 'primeng/tooltip';
import { Message } from 'primeng/message';

@Component({
  selector: 'ii-user-reset-password',
  templateUrl: './user-reset-password.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputText,
    PasswordModule,
    IconField,
    InputIcon,
    FocusTrap,
    Tooltip,
    Message,
  ],
})
export default class UserResetPassword {
  private _supabaseService = inject(SupabaseService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _toaster = inject(ToastService);

  protected resetForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  protected isSubmitting = signal(false);
  protected validationFailed = signal(false);

  protected async onResetPassword() {
    if (
      this.resetForm.invalid ||
      this.resetForm.value.password !== this.resetForm.value.confirmPassword
    ) {
      this.validationFailed.set(true);
      return;
    }

    this.validationFailed.set(false);
    this.isSubmitting.set(true);

    const password = this.resetForm.value.password!;
    try {
      const { error } = await this._supabaseService.updateUserPassword(password);

      if (error) {
        this._toaster.showWarning(error.message);
      } else {
        this._toaster.showSuccess('Passwort erfolgreich geändert!');
        await this._router.navigate(['/login']);
      }
    } catch (err) {
      console.error('Error occurred - resetting the password: ' + err);
      this._toaster.showWarning('Fehler beim Setzen des Passworts. Bitte versuchen Sie es erneut.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected async onAbort() {
    await this._router.navigate(['/login']);
  }
}
