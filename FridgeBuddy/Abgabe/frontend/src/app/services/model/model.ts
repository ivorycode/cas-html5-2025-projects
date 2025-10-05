import { FormControl } from '@angular/forms';

export interface GroceryData {
	id: number;
	name: string;
	status: 'open' | 'reserved' | 'gone';
	photo: string;
	description: string;
	expireDate: string;
	owner: number;
	quantity: number;
	vegan: boolean;
	vegetarian: boolean;
	ipSuisse: boolean;
	bio: boolean;
	requester: string | null;
	allowedActions: AllowedActions[];
}

export interface GroceryApiData {
	count: number; // total amount of groceries
	next: string;
	previous: string;
	results: GroceryData[];
}

export type AllowedActions =
	| 'reserve'
	| 'unreserve'
	| 'update'
	| 'delete'
	| 'confirm';

export interface ProfileForm {
	username: string;
	password: string;
}
export interface LoginData {
	access: string;
	refresh: string;
}

export interface Buddy {
	id: number;
	user: number;
	username: string;
	bio: string;
	phone: string;
	profileImage: string;
	street: string;
	city: string;
	postcode: string;
	country: string;
	vegetarian: boolean;
	vegan: boolean;
}

export type GroceryFormRequest = Omit<
	GroceryData,
	'id' | 'owner' | 'status' | 'photo' | 'allowedActions' | 'requester'
> & {
	photo: File | null;
};

export interface GroceryFormControls {
	product: FormControl<string>;
	description: FormControl<string>;
	expireDate: FormControl<Date>;
	quantity: FormControl<number>;
	photo: FormControl<File | null>;
	vegan: FormControl<boolean>;
	vegetarian: FormControl<boolean>;
	ipSuisse: FormControl<boolean>;
	bio: FormControl<boolean>;
}
