import { Component, input } from '@angular/core';
import {
	MatCard,
	MatCardContent,
	MatCardHeader,
	MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-card-generic',
	imports: [MatCard, MatCardTitle, MatIcon, MatCardHeader, MatCardContent],
	templateUrl: './card-generic.html',
})
export class CardGeneric {
	message = input.required<string>();
	matCardCssClass = input.required<string>();
	matIcon = input.required<string>();
}
