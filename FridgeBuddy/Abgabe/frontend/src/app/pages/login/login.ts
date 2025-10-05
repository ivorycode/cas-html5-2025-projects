import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/api/authentication.service';
import { LoginData, ProfileForm } from '../../services/model/model';
import { NotificationService } from '../../services/ui/notification.service';
@Component({
	selector: 'app-login',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatCard,
		MatIcon,
		MatProgressSpinner,
		MatCheckbox,
		MatButtonModule,
	],
	templateUrl: './login.html',
})
export class Login {
	router = inject(Router);
	route = inject(ActivatedRoute);
	authService = inject(AuthenticationService);
	notificationService = inject(NotificationService);

	showPassword = signal(false);
	loading = signal(false);
	errorMsg = signal('');
	returnUrl: string;

	profileForm = new FormGroup({
		username: new FormControl<string>(''),
		password: new FormControl<string>(''),
	});

	constructor() {
		// Route the user tried to access
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
		if (this.returnUrl.replace('/', '')) {
			this.notificationService.showNotification(
				'error',
				'Logge dich erst ein!',
				'temporary',
			);
		}
	}
	onSubmit() {
		this.loading.set(true);
		if (this.profileForm.invalid) {
			this.loading.set(false);
			console.log('Form is invalid.');
			this.errorMsg.set('Form nicht ok');
			return;
		}

		const credentials = this.profileForm.getRawValue() as ProfileForm;

		this.authService.getAuth(credentials).subscribe({
			next: (data: LoginData) => {
				localStorage.setItem('access_token', data.access);
				localStorage.setItem('refresh_token', data.refresh);
				localStorage.setItem('username', credentials.username);

				this.authService.updateLoginStatus(true);
				this.loading.set(false);

				// If user tried to access a guarded route, we send him there after sucessfull login
				this.router.navigateByUrl(this.returnUrl);
			},
			error: (err) => {
				console.error('Login failed:', err);
				this.loading.set(false);
				this.errorMsg.set('Login nicht ok.');
			},
		});
	}
	updateShowPassword(event: boolean) {
		this.showPassword.set(event);
	}
}
