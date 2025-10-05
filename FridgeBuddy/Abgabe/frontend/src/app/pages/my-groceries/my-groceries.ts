import { Component, computed, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CardError } from '../../components/card-error/card-error';
import { CardInfo } from '../../components/card-info/card-info';
import { GroceryCard } from '../../components/grocery-card/grocery-card';
import { MyGroceryService } from '../../services/api/my-groceries.service';
import { AllowedActions } from '../../services/model/model';

@Component({
	selector: 'app-my-groceries',
	imports: [MatProgressSpinner, CardError, CardInfo, GroceryCard],
	templateUrl: './my-groceries.html',
})
export class MyGroceries {
	myGroceryService = inject(MyGroceryService);

	myGroceriesSorted = computed(() => {
		if (this.myGroceryService.getMyGroceriesResource.hasValue()) {
			const myGroceries = this.myGroceryService.getMyGroceriesResource.value();
			return myGroceries.sort((a, b) => {
				// sort by id, if status is the same
				if (a.status === b.status) return a.id - b.id;
				// move reserved items to the front
				return a.status === 'reserved' ? -1 : 1;
			});
		}
		return undefined;
	});

	afterGroceryModified(_action: AllowedActions) {
		// we only need to reload myGroceries resource, because other resources won't be affected by this change (your own groceries don't appear in the main view)
		this.myGroceryService.getMyGroceriesResource.reload();
	}
}
