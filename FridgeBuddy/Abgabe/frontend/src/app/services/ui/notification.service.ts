import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	constructor(private snackBar: MatSnackBar) {}

	showNotification(
		type: 'success' | 'error' = 'success',
		message: string | undefined,
		durationPreset: 'temporary' | 'infinite' = 'temporary',
	): void {
		let action: string | undefined;
		let duration: number | undefined;
		if (durationPreset === 'infinite') {
			action = 'ｘ'; // 🆇Ⓧⓧ🅧𝓧𝗫
			duration = undefined; // show notification indefinitely
		} else {
			duration = 2000;
		}
		this.snackBar.dismiss();
		this.snackBar.open(`${message}`, action, {
			duration,
			panelClass: `snackbar-${type}`,
			// moved snackbar notification to top left because grocery-form page stays on the left side as well and does not grow
			horizontalPosition: 'left',
			verticalPosition: 'top',
		});
	}

	showTemporaryGenericError() {
		this.showNotification(
			'error',
			'Es ist ein Fehler aufgetreten! Wir kümmern uns darum!',
		);
	}
}
