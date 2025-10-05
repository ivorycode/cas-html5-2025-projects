import { Component, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CardError } from '../../components/card-error/card-error';
import { CardInfo } from '../../components/card-info/card-info';
import { GroceryCard } from '../../components/grocery-card/grocery-card';
import { GroceriesService } from '../../services/api/groceries.service';
import { ReservationService } from '../../services/api/reservation.service';
import { AllowedActions } from '../../services/model/model';

@Component({
	selector: 'app-my-reservations',
	imports: [GroceryCard, MatProgressSpinner, CardInfo, CardError],
	templateUrl: './my-reservations.html',
})
export class MyReservations {
	reservationService = inject(ReservationService);
	groceriesService = inject(GroceriesService);

	afterGroceryModified(action: AllowedActions) {
		// when we reserve an item, it happens from the main page or grocery-detail page, so we need to reload the reservedGroceries API (updates the number on the badge in navigation)
		this.reservationService.reservedGroceriesResource.reload();

		// after "unreserving" an item, we also need to reload the main grocery list
		if (action === 'unreserve') {
			this.groceriesService.getGroceriesResource.reload();
		}
	}
}
