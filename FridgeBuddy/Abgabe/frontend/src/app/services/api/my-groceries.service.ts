import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BASE_URL } from '../../app.config';
import { GroceryData } from '../model/model';
import { AuthenticationService } from './authentication.service';

@Injectable({
	providedIn: 'root',
})
export class MyGroceryService {
	http = inject(HttpClient);
	authentication = inject(AuthenticationService);

	getMyGroceriesResource = httpResource<GroceryData[]>(() =>
		this.authentication.isLoggedIn()
			? `${BASE_URL}/groceries/v1/my-offered-groceries/`
			: undefined,
	);

	// multipart/form-data doesn't work yet with httpResource, so we need to use HttpClient
	addGrocery(formData: FormData) {
		return this.http.post(`${BASE_URL}/groceries/api/v1/groceries/`, formData);
	}

	// multipart/form-data doesn't work yet with httpResource, so we need to use HttpClient
	modifyGrocery(groceryId: string, formData: FormData) {
		return this.http.put<{ detail: string }>(
			`${BASE_URL}/groceries/v1/my-groceries/${groceryId}/`,
			formData,
		);
	}

	deleteGrocery(groceryId: number) {
		return this.http.delete<{ detail: string }>(
			`${BASE_URL}/groceries/v1/my-groceries/${groceryId}/`,
		);
	}

	confirmGroceryPickup(groceryId: number) {
		return this.http.patch(
			`${BASE_URL}/groceries/v1/my-groceries/${groceryId}/`,
			{
				status: 'gone',
			},
		);
	}
}
