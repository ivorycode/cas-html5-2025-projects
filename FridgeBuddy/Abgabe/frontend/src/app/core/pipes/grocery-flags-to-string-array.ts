import { Pipe, PipeTransform } from '@angular/core';
import { GroceryData } from '../../services/model/model';

@Pipe({
	name: 'groceryFlagsToStringArray',
})
export class GroceryFlagsToStringArrayPipe implements PipeTransform {
	transform(g: GroceryData, ..._args: unknown[]): string[] {
		const flagTextRepresentation = [];
		if (g.vegan) {
			flagTextRepresentation.push('🌱🌱 Vegan');
		} else {
			if (g.vegetarian) {
				flagTextRepresentation.push('🌱 Vegetarisch');
			}
		}
		if (g.ipSuisse) {
			flagTextRepresentation.push('🐞IP-Suisse');
		}
		if (g.bio) {
			flagTextRepresentation.push('🌻 Bio');
		}
		return flagTextRepresentation;
	}
}
