import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BASE_URL } from '../../app.config';
import { AllowedActions, GroceryData } from '../model/model';
import { AuthenticationService } from './authentication.service';

@Injectable({
	providedIn: 'root',
})
export class ReservationService {
	http = inject(HttpClient);
	authentication = inject(AuthenticationService);

	reservedGroceriesResource = httpResource<GroceryData[]>(() =>
		this.authentication.isLoggedIn()
			? `${BASE_URL}/groceries/v1/my-requests/`
			: undefined,
	);

	modifyReservation(
		groceryId: number | string,
		mode: Extract<AllowedActions, 'reserve' | 'unreserve'>,
	) {
		if (mode === 'reserve') {
			return this.http.post<{ detail: string }>(
				`${BASE_URL}/groceries/v1/groceries/${groceryId}/request/`,
				undefined,
			);
		}
		return this.http.delete<{ detail: string }>(
			`${BASE_URL}/groceries/v1/groceries/${groceryId}/request/`,
		);
	}
}
