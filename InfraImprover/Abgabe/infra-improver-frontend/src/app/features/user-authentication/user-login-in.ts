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
import { ToastService } from '../../core/toast-service';
import { SupabaseService } from '../../core/supabase-service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IftaLabel } from 'primeng/iftalabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FocusTrap } from 'primeng/focustrap';
import { Tooltip } from 'primeng/tooltip';
import { Message } from 'primeng/message';
import { AutoFocus } from 'primeng/autofocus';
import { Image } from 'primeng/image';

@Component({
  selector: 'ii-user-sign-in',
  templateUrl: './user-login-in.html',
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
    Tooltip,
    Message,
    AutoFocus,
    Image,
  ],
})
export default class UserLoginIn {
  private _supabaseService: SupabaseService = inject(SupabaseService);
  private _router: Router = inject(Router);
  private _toaster: ToastService = inject(ToastService);

  protected isUserSignInLoading = signal(false);
  protected isUserSignUpLoading = signal(false);
  protected validationFailed = signal(false);

  protected loginForm: FormGroup = new FormGroup({
    email: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email]),
    password: new FormControl({ value: '', disabled: false }, [Validators.required]),
  });

  protected async onSignInUser() {
    if (this.loginForm.invalid) {
      this.validationFailed.set(true);
      console.warn('Sign-In failed, since form was invalid.');
      return;
    }
    this.validationFailed.set(false);
    this.isUserSignInLoading.set(true);
    this.loginForm.controls['email']?.disable();
    this.loginForm.controls['password']?.disable();
    const { email, password } = this.loginForm.value;
    const { error } = await this._supabaseService.signInUser(email, password);
    if (error) {
      this._toaster.showWarning(error.message);
    } else {
      this.loginForm.reset();
      await this._router.navigate(['/home']);
      this._toaster.showSuccess('Login erfolgreich!');
    }
    this.loginForm.controls['email']?.enable();
    this.loginForm.controls['password']?.enable();
    this.isUserSignInLoading.set(false);
  }

  protected async onSignUpUser() {
    await this._router.navigate(['/login/signup']);
  }

  protected async onRestorePassword() {
    await this._router.navigate(['/login/restore']);
  }
}
