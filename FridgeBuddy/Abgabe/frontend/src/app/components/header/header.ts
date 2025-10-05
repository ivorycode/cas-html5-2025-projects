import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadge } from '@angular/material/badge';
import { MatIconButton } from '@angular/material/button';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
	ActivatedRoute,
	Router,
	RouterLink,
	RouterLinkActive,
} from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { routeConfig } from '../../app.routes';
import { AuthenticationService } from '../../services/api/authentication.service';
import { GroceriesService } from '../../services/api/groceries.service';
import { MyGroceryService } from '../../services/api/my-groceries.service';
import { ReservationService } from '../../services/api/reservation.service';

@Component({
	selector: 'app-header',
	imports: [
		RouterLink,
		NgTemplateOutlet,
		MatIcon,
		MatMenu,
		MatMenuItem,
		MatMenuTrigger,
		MatInput,
		ReactiveFormsModule,
		MatChipListbox,
		MatChipOption,
		MatIconButton,
		MatBadge,
		FormsModule,
		RouterLinkActive,
	],
	templateUrl: './header.html',
})
export class Header {
	namedRouteConfig = routeConfig;
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);
	authService = inject(AuthenticationService);
	groceriesService = inject(GroceriesService);
	reservationService = inject(ReservationService);
	myGroceryService = inject(MyGroceryService);

	username = this.authService.username;
	isLoggedIn = this.authService.isLoggedIn;

	readonly searchInputFormControl = new FormControl('');
	readonly searchTextDebounced = this.searchInputFormControl.valueChanges.pipe(
		debounceTime(500),
		distinctUntilChanged(),
		map((value) => `${value}`.trim()),
	);
	readonly searchText = toSignal(this.searchTextDebounced);

	readonly additionalFilter = computed(() => {
		const selectedEatingHabits = this.selectedEatingHabits();
		const selectedLabels = this.selectedLabels();
		const vegetarian = selectedEatingHabits.includes('Vegi') ? true : undefined;
		const vegan = selectedEatingHabits.includes('Vegan') ? true : undefined;
		const bio = selectedLabels.includes('Bio') ? true : undefined;
		const ipSuisse = selectedLabels.includes('IP-Suisse') ? true : undefined;
		return {
			vegetarian,
			vegan,
			bio,
			ipSuisse,
		};
	});

	constructor() {
		effect(async () => {
			const searchText = this.searchText();
			const filter = this.additionalFilter();
			// unfortunately the initial page load triggers an additional INITIAL API request (which is canceled by angular.. like when using switchMap)
			this.groceriesService.getGroceriesFilter.update((state) => ({
				...state,
				...(searchText !== undefined && { name: searchText }),
				...filter,
				page: 0, // when the filter changed, we always start with the first page
			}));
			if (searchText !== undefined) {
				this.searchInputFormControl.setValue(searchText);
				// if user searched NOT from homepage, we redirect him to home page
				if (
					this.activatedRoute.firstChild?.snapshot?.title !==
					routeConfig.home.title
				) {
					await this.router.navigate([routeConfig.home.path]);
				}
			}
		});
	}

	// once we have more labels, we should probably create a type for this and/or extend the API appropriately
	selectedEatingHabits = signal<string[]>([]);
	eatingHabits = ['Vegi', 'Vegan'];
	toggleEatingHabits(eatingHabit: string) {
		const current = this.selectedEatingHabits();
		if (current.includes(eatingHabit)) {
			this.selectedEatingHabits.set(current.filter((f) => f !== eatingHabit));
		} else {
			this.selectedEatingHabits.set([...current, eatingHabit]);
		}
	}

	// once we have more labels, we should probably create a type for this and/or extend the API appropriately
	selectedLabels = signal<string[]>([]);
	labels = ['Bio', 'IP-Suisse'];
	toggleLabels(label: string) {
		const current = this.selectedLabels();
		if (current.includes(label)) {
			this.selectedLabels.set(current.filter((f) => f !== label));
		} else {
			this.selectedLabels.set([...current, label]);
		}
	}

	clearAllFilters() {
		if (
			this.selectedEatingHabits().length !== 0 ||
			this.selectedLabels().length !== 0
		) {
			this.selectedEatingHabits.set([]);
			this.selectedLabels.set([]);
		}
	}
}
