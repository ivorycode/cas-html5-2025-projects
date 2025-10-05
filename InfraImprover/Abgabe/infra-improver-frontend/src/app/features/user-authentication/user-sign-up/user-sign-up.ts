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
  selector: 'ii-sign-up',
  templateUrl: './user-sign-up.html',
  standalone: true,
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
export default class UserSignUp {
  private _supabaseService: SupabaseService = inject(SupabaseService);
  private _router: Router = inject(Router);
  private _toaster: ToastService = inject(ToastService);

  protected validationFailed = signal(false);
  protected isUserSignUpLoading = signal(false);

  protected signInForm: FormGroup = new FormGroup({
    email: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email]),
    password: new FormControl({ value: '', disabled: false }, [Validators.required]),
  });

  protected async onSignUpUser() {
    if (this.signInForm.invalid) {
      this.validationFailed.set(true);
      console.warn('Sign-Up failed, since form was invalid.');
      return;
    }
    this.validationFailed.set(false);
    this.isUserSignUpLoading.set(true);
    this.signInForm.controls['email']?.disable();
    this.signInForm.controls['password']?.disable();
    const { email, password } = this.signInForm.value;
    const { error } = await this._supabaseService.signUpUser(email, password);
    if (error) {
      this._toaster.showWarning(error.message);
    } else {
      this._toaster.showSuccess('Registrierung erfolgreich! Bitte bestätige deine E-Mail.');
    }
    this.signInForm.controls['email']?.enable();
    this.signInForm.controls['password']?.enable();
    this.isUserSignUpLoading.set(false);
    await this._router.navigate(['/login']);
  }
  protected async onAbort() {
    await this._router.navigate(['/login']);
  }
}
