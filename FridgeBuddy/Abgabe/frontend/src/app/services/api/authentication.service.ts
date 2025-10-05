import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../app.config';
import { LoginData, ProfileForm } from '../model/model';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	http = inject(HttpClient);

	isAuthenticated = (): boolean => {
		return !!localStorage.getItem('access_token');
	};

	isLoggedIn = signal<boolean>(this.isAuthenticated());
	username = signal<string | null>(localStorage.getItem('username'));

	getAuth = (profileForm: ProfileForm): Observable<LoginData> => {
		const payload = {
			username: profileForm.username,
			password: profileForm.password,
		};
		this.username.set(profileForm.username);
		return this.http.post<LoginData>(`${BASE_URL}/api/token/`, payload);
	};

	logout(): void {
		localStorage.clear();
		this.isLoggedIn.set(false);
		this.username.set(null);
	}

	updateLoginStatus(status: boolean): void {
		this.isLoggedIn.set(status);
	}
}
