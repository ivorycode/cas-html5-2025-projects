import { httpResource } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { BASE_URL } from '../../app.config';
import { Buddy } from '../model/model';

@Injectable({
	providedIn: 'root',
})
export class BuddyDetailService {
	createBuddyDetailsResource(buddyId: Signal<number | undefined>) {
		return httpResource<Buddy>(() => {
			if (buddyId() === undefined) {
				return undefined; // No request will be made
			}
			return `${BASE_URL}/users/v1/user-detail/${buddyId()}`;
		});
	}
}
