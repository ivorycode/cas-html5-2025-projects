import { Injectable, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class TitleService {
	activatedRoute = inject(ActivatedRoute);

	getTitle() {
		let child = this.activatedRoute.firstChild;
		while (child?.firstChild) {
			child = child.firstChild;
		}
		return child?.snapshot.title || '';
	}

	shouldDisplayTitle() {
		let child = this.activatedRoute.firstChild;
		while (child?.firstChild) {
			child = child.firstChild;
		}
		return child?.snapshot.data?.['shouldDisplayTitle'] ?? true;
	}
}
