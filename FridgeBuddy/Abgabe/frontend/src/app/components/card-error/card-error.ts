import { Component, input } from '@angular/core';
import { CardGeneric } from '../card-generic/card-generic';

@Component({
	selector: 'app-card-error',
	imports: [CardGeneric],
	templateUrl: './card-error.html',
})
export class CardError {
	message = input.required<string>();
}
