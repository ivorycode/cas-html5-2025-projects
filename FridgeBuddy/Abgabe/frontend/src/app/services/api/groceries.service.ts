import { httpResource } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { BASE_URL } from '../../app.config';
import { GroceryApiData, GroceryData } from '../model/model';

@Injectable({
	providedIn: 'root',
})
export class GroceriesService {
	readonly getGroceriesFilter = signal<{
		page: number;
		name: string;
		vegetarian?: boolean | undefined;
		vegan?: boolean | undefined;
		bio?: boolean | undefined;
		ipSuisse?: boolean | undefined;
	}>({
		name: '',
		page: 0,
	});
	readonly getGroceriesResource = httpResource<GroceryApiData>(() => {
		const data = this.getGroceriesFilter();
		if (data) {
			return {
				url: `${BASE_URL}/groceries/api/v1/groceries/`,
				method: 'GET',
				params: {
					page: data.page + 1, // backend has 1-based index and angular material 0-based index
					...(data.name && { name: data.name }),
					...(data.vegetarian && { vegetarian: data.vegetarian }),
					...(data.vegan && { vegan: data.vegan }),
					...(data.bio && { bio: data.bio }),
					...(data.ipSuisse && { ipsuisse: data.ipSuisse }),
				},
			};
		}
		return undefined;
	});

	// we need a function here so we can create separate instances of httpResource
	createGroceryDetailsResource(groceryId: Signal<string | undefined>) {
		return httpResource<GroceryData>(() => {
			if (groceryId() === undefined) {
				return undefined;
			}
			return `${BASE_URL}/groceries/v1/groceries/${groceryId()}`;
		});
	}
}
