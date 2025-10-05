import { Component, input } from '@angular/core';
import { CardGeneric } from '../card-generic/card-generic';

@Component({
	selector: 'app-card-info',
	imports: [CardGeneric],
	templateUrl: './card-info.html',
})
export class CardInfo {
	message = input.required<string>();
}
