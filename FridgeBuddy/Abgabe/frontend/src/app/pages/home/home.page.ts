import { OverlayModule } from '@angular/cdk/overlay';
import { Component, computed, effect, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { CardInfo } from '../../components/card-info/card-info';
import { GroceryCard } from '../../components/grocery-card/grocery-card';
import { GroceriesService } from '../../services/api/groceries.service';
import { ReservationService } from '../../services/api/reservation.service';
import { AllowedActions } from '../../services/model/model';
import { NotificationService } from '../../services/ui/notification.service';

@Component({
	selector: 'app-home',
	imports: [
		GroceryCard,
		MatProgressSpinner,
		OverlayModule,
		MatPaginator,
		CardInfo,
	],
	templateUrl: './home.page.html',
})
export class HomePage {
	router = inject(Router);
	notificationService = inject(NotificationService);
	groceriesService = inject(GroceriesService);
	reservationService = inject(ReservationService);

	groceriesFilter = this.groceriesService.getGroceriesFilter;
	groceriesData = computed(() => this.groceriesService.getGroceriesResource);
	pageIndex = computed(() => this.groceriesFilter().page);

	constructor() {
		effect(() => {
			if (this.groceriesData().error()) {
				this.notificationService.showNotification(
					'error',
					`Es ist ein Fehler beim Suchen der Produkte aufgetreten! Wir kümmern uns darum!`,
				);
			}
		});
	}

	handlePageEvent(event: PageEvent) {
		this.groceriesFilter.update((state) => ({
			...state,
			// only update pageIndex and keep original query
			name: state.name,
			page: event.pageIndex,
		}));
	}

	afterGroceryModified(action: AllowedActions) {
		if (action === 'reserve') {
			// a reservation happened from the main page, so we need to reload the groceries resource
			this.groceriesService.getGroceriesResource.reload();
			// and also the reserved groceries resource (to update the badge in the nav item)
			this.reservationService.reservedGroceriesResource.reload();
		}
	}
}
