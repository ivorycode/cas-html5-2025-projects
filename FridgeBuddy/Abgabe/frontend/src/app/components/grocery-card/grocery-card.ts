import { DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
	MatCard,
	MatCardActions,
	MatCardContent,
	MatCardHeader,
	MatCardSmImage,
	MatCardSubtitle,
	MatCardTitle,
	MatCardTitleGroup,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { routeConfig } from '../../app.routes';
import { GroceryFlagsToStringArrayPipe } from '../../core/pipes/grocery-flags-to-string-array';
import { MyGroceryService } from '../../services/api/my-groceries.service';
import { ReservationService } from '../../services/api/reservation.service';
import { AllowedActions, GroceryData } from '../../services/model/model';
import { NotificationService } from '../../services/ui/notification.service';

@Component({
	selector: 'app-grocery-card',
	imports: [
		MatCard,
		MatCardHeader,
		MatCardTitle,
		MatCardSubtitle,
		MatCardContent,
		MatCardTitleGroup,
		MatCardActions,
		MatIcon,
		MatIconButton,
		MatCardSmImage,
		DatePipe,
		GroceryFlagsToStringArrayPipe,
	],
	templateUrl: './grocery-card.html',
	styleUrl: './grocery-card.css',
})
export class GroceryCard {
	grocery = input.required<GroceryData>();

	router = inject(Router);
	reservationService = inject(ReservationService);
	notificationService = inject(NotificationService);
	myGroceryService = inject(MyGroceryService);

	modificationSucceded = output<AllowedActions>();

	handleClick(groceryId: number) {
		this.router.navigate([
			// we need to replace the dynamic url part
			routeConfig.groceryDetail.path.replace(':groceryId', ''),
			groceryId,
		]);
	}

	modifyReservation(
		groceryId: number,
		mode: Extract<AllowedActions, 'reserve' | 'unreserve'>,
	) {
		this.reservationService.modifyReservation(groceryId, mode).subscribe({
			next: (res) => {
				this.notificationService.showNotification('success', res.detail);
				this.modificationSucceded.emit(mode);
			},
			error: (err) => {
				this.notificationService.showNotification(
					'error',
					'error' in err && err.error && 'detail' in err.error
						? err.error.detail
						: undefined,
					'infinite',
				);
			},
		});
	}

	deleteGrocery(groceryId: number) {
		this.myGroceryService.deleteGrocery(groceryId).subscribe({
			next: (_res) => {
				this.notificationService.showNotification(
					'success',
					'Produkt wurde gelöscht',
				);
				this.modificationSucceded.emit('delete');
			},
			error: (err) => {
				this.notificationService.showNotification(
					'error',
					'error' in err && err.error && 'detail' in err.error
						? err.error.detail
						: undefined,
					'infinite',
				);
			},
		});
	}

	hasAction(grocery: GroceryData, action: AllowedActions) {
		return grocery.allowedActions.includes(action);
	}

	editGrocery(groceryId: number) {
		this.router.navigate([routeConfig.groceryForm.path], {
			queryParams: { groceryId },
			replaceUrl: true, // URL actually changes. it's necessary so the navigation to an empty grocery form works
		});
	}

	confirmPickup(groceryId: number) {
		this.myGroceryService.confirmGroceryPickup(groceryId).subscribe({
			next: (_res) => {
				this.notificationService.showNotification(
					'success',
					'Produkt wurde als abgeholt markiert',
				);
				this.modificationSucceded.emit('confirm');
			},
			error: (err) => {
				this.notificationService.showNotification(
					'error',
					'error' in err && err.error && 'detail' in err.error
						? err.error.detail
						: undefined,
					'infinite',
				);
			},
		});
	}
}
