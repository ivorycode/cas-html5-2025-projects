import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { MatFileUploadComponent, MatFileUploadModule } from 'mat-file-upload';
import { map } from 'rxjs';
import { GroceriesService } from '../../services/api/groceries.service';
import { MyGroceryService } from '../../services/api/my-groceries.service';
import {
	GroceryFormControls,
	GroceryFormRequest,
} from '../../services/model/model';
import { NotificationService } from '../../services/ui/notification.service';

@Component({
	selector: 'app-grocery-form',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatButtonModule,
		MatFileUploadModule,
		MatCard,
		NgClass,
		MatCheckbox,
		MatProgressSpinner,
	],
	templateUrl: './grocery-form.html',
})
export class GroceryForm {
	activatedRoute = inject(ActivatedRoute);
	groceriesService = inject(GroceriesService);
	notificationService = inject(NotificationService);
	myGroceryService = inject(MyGroceryService);

	form = new FormGroup<GroceryFormControls>({
		product: new FormControl<string>('', {
			validators: [Validators.required, Validators.maxLength(255)],
			nonNullable: true,
		}),
		description: new FormControl<string>('', { nonNullable: true }),
		// since the validator is required, we will always have a value once the form is valid
		// and here we just want an initially empty field
		expireDate: new FormControl<Date>(undefined as unknown as Date, {
			validators: [Validators.required],
			nonNullable: true,
		}),
		quantity: new FormControl<number>(undefined as unknown as number, {
			validators: [Validators.required],
			nonNullable: true,
		}),
		photo: new FormControl<File | null>(null),
		vegan: new FormControl<boolean>(false, { nonNullable: true }),
		vegetarian: new FormControl<boolean>(false, { nonNullable: true }),
		ipSuisse: new FormControl<boolean>(false, { nonNullable: true }),
		bio: new FormControl<boolean>(false, { nonNullable: true }),
	});

	titleMaxLength = 100;
	expireDateMin = computed(() => {
		// for existing products we allow the minDate to be the previously set expiry date
		if (this.editMode() && this.groceryDetailsResource.hasValue()) {
			return new Date(this.groceryDetailsResource.value()?.expireDate);
		}
		// for new products, the expiry date cannot be earlier than today
		return new Date();
	});

	veganCheckboxValue = toSignal(this.form.controls.vegan.valueChanges);
	fileUploadComponent = viewChild.required<MatFileUploadComponent>(
		MatFileUploadComponent,
	);

	// edit mode specific signals
	groceryId = toSignal(
		this.activatedRoute.queryParamMap.pipe(
			map((p) => p.get('groceryId') ?? undefined),
		),
	);
	// we don't want to share the signal with grocery-detail page, so we create a separate httpResource
	groceryDetailsResource = this.groceriesService.createGroceryDetailsResource(
		this.groceryId,
	);
	editMode = computed(() => {
		return this.groceryId() !== undefined;
	});

	constructor() {
		effect(() => {
			const value = this.veganCheckboxValue();
			if (value !== undefined) {
				if (value) {
					// only update vegetarian when vegan option was set to true
					this.form.controls.vegetarian.setValue(value);
				}
			}
			if (value === true) {
				this.form.controls.vegetarian.disable();
			} else {
				this.form.controls.vegetarian.enable();
			}
		});

		// update form if we are editing an item
		effect(() => {
			const editMode = this.editMode();
			if (editMode) {
				if (this.groceryDetailsResource.hasValue()) {
					const details = this.groceryDetailsResource.value();
					this.form.patchValue({
						product: details?.name,
						description: details?.description,
						quantity: details?.quantity,
						expireDate: new Date(details?.expireDate),
						vegetarian: details?.vegetarian,
						vegan: details?.vegan,
						ipSuisse: details?.ipSuisse,
						bio: details?.bio,
					});
				}
			} else {
				this.form.reset();
			}
		});
	}

	selectedFilesChanged(event: FileList) {
		this.form.controls.photo.setValue(event ? event[0] : null);
	}

	submitForm(): void {
		this.form.markAllAsTouched();
		if (this.form.invalid) {
			return;
		}
		const payload = this.createPayload();
		const formData = this.createFormData(payload);
		const groceryId = this.groceryId();
		if (this.editMode() && groceryId) {
			this.modifyGrocery(groceryId, formData);
		} else {
			this.addGrocery(formData);
		}
	}

	addGrocery(formData: FormData) {
		this.myGroceryService.addGrocery(formData).subscribe({
			next: (_res) => {
				// KNOWN ISSUE: resetting the file input doesn't work from outside
				this.fileUploadComponent().resetFileInput();
				this.form.reset();
				this.form.markAsPristine();
				this.notificationService.showNotification(
					'success',
					'Produkt erfolgreich hinzugefügt!',
				);
			},
			error: (_err) => {
				// don't reset the form in case of an error... the user can just try again
				this.notificationService.showNotification(
					'error',
					'Das Produkt konnte nicht hinzugefügt werden! Wir kümmern uns darum!',
				);
			},
		});
	}

	modifyGrocery(groceryId: string, formData: FormData) {
		this.myGroceryService.modifyGrocery(groceryId, formData).subscribe({
			next: (_res) => {
				// here we don't
				this.notificationService.showNotification(
					'success',
					'Produkt erfolgreich bearbeitet!',
				);
			},
			error: (_err) => {
				// don't reset the form in case of an error... the user can just try again
				this.notificationService.showNotification(
					'error',
					'Das Produkt konnte nicht bearbeitet werden! Wir kümmern uns darum!',
				);
			},
		});
	}

	createFormData(payload: GroceryFormRequest) {
		const formData = new FormData();
		Object.entries(payload).forEach(([key, value]) => {
			if (key === 'photo') {
				// only append photo if it's not null. backend doesn't like null.
				if (value instanceof File) {
					formData.append(key, value);
				}
			} else {
				formData.append(key, `${value}`); // convert anything else to a string
			}
		});
		return formData;
	}

	createPayload() {
		// if the form is valid, then all required fields are set and we don't have to deal with undefined values here.
		const {
			product,
			description,
			expireDate,
			quantity,
			photo,
			vegan,
			vegetarian,
			ipSuisse,
			bio,
		} = this.form.getRawValue();

		// convert to local date
		const offset = expireDate.getTimezoneOffset();
		const expireDateLocal = new Date(expireDate.getTime() - offset * 60 * 1000)
			.toISOString()
			.split('T')[0];

		// create object for API call
		return {
			name: product,
			description: description,
			expireDate: expireDateLocal,
			quantity: quantity,
			photo: photo,
			vegan: vegan,
			vegetarian: vegetarian,
			ipSuisse: ipSuisse,
			bio: bio,
		} satisfies GroceryFormRequest;
	}
}
