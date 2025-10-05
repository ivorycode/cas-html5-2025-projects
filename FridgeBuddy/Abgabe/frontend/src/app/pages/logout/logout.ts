import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/api/authentication.service';

@Component({
	selector: 'app-logout',
	imports: [],
	template: '', // we never display this page
})
export class Logout {
	router = inject(Router);

	authService = inject(AuthenticationService);

	constructor() {
		this.authService.logout();
		this.router.navigate(['/login']);
	}
}
