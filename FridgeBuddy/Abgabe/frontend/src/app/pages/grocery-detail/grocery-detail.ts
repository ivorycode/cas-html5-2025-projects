import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { routeConfig } from '../../app.routes';
import { GroceryFlagsToStringArrayPipe } from '../../core/pipes/grocery-flags-to-string-array';
import { AuthenticationService } from '../../services/api/authentication.service';
import { BuddyDetailService } from '../../services/api/buddy-detail.service';
import { GroceriesService } from '../../services/api/groceries.service';
import { ReservationService } from '../../services/api/reservation.service';
import { NotificationService } from '../../services/ui/notification.service';

@Component({
	selector: 'app-grocery-detail',
	imports: [
		MatCard,
		MatProgressSpinner,
		NgClass,
		MatButton,
		DatePipe,
		GroceryFlagsToStringArrayPipe,
	],
	templateUrl: './grocery-detail.html',
	styleUrl: './grocery-detail.css',
})
export class GroceryDetail {
	router = inject(Router);
	groceriesService = inject(GroceriesService);
	authService = inject(AuthenticationService);
	buddyService = inject(BuddyDetailService);
	notificationService = inject(NotificationService);
	reservationService = inject(ReservationService);
	isLoggedIn = this.authService.isAuthenticated();

	// query param injected by withComponentInputBinding()
	groceryId = input.required<string>();
	groceryDetailsResource = this.groceriesService.createGroceryDetailsResource(
		this.groceryId,
	);

	// trigger buddyDetails request automatically whenever there is an owner. the backend should check whether the current user is the requester and only then return the owner id / owner details
	buddyId = computed(() => this.groceryDetailsResource.value()?.owner);
	buddyDetailsResource = this.buddyService.createBuddyDetailsResource(
		this.buddyId,
	);

	translatedStatus = computed(() => {
		if (this.groceryDetailsResource.hasValue()) {
			const resourceValue = this.groceryDetailsResource.value();
			switch (resourceValue.status) {
				case 'open':
					return 'offen';
				case 'reserved':
					return 'reserviert';
				case 'gone':
					return 'abgeholt';
			}
		}
		return undefined;
	});

	constructor() {
		effect(() => {
			if (this.groceryDetailsResource.error()) {
				this.notificationService.showNotification(
					'error',
					'Fehler beim Laden der Produktdetails!',
					'infinite',
				);
			}

			if (this.buddyDetailsResource.error()) {
				this.notificationService.showNotification(
					'error',
					'Fehler beim Laden der Kontaktinformationen',
					'infinite',
				);
			}
		});
	}

	handleReserve() {
		if (!this.isLoggedIn) {
			this.router.navigate([routeConfig.login.path], {
				queryParams: { returnUrl: this.router.url },
			});
			return;
		}

		this.reservationService
			.modifyReservation(this.groceryId(), 'reserve')
			.subscribe({
				next: () => {
					// reload grocery details
					this.groceryDetailsResource.reload();

					this.notificationService.showNotification(
						'success',
						'Lebensmittel erfolgreich reserviert!',
						'temporary',
					);

					// a reservation happened, so we need to reload the groceries resource
					this.groceriesService.getGroceriesResource.reload();
					// and also the reserved groceries resource (to update the badge in the nav item)
					this.reservationService.reservedGroceriesResource.reload();
				},
				error: () => {
					this.notificationService.showNotification(
						'error',
						'Fehler beim Reservieren dieses Lebensmittels.',
						'infinite',
					);
				},
			});
	}
}
