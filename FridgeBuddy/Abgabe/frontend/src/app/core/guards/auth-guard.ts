import { inject } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivateFn,
	Router,
	RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from '../../services/api/authentication.service';

/*
  Check if user is logged in. If user is not logged in and tried to access a guard route,
  we store the route he tried to access and send him there when is sucassfully logged in
*/
export const authGuard: CanActivateFn = (
	_route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot,
) => {
	const authService = inject(AuthenticationService);
	const router = inject(Router);

	if (authService.isAuthenticated()) {
		return true;
	}

	const returnUrl = state.url; // Attempted URL

	// Redirect to the login page, passing the returnUrl as a query parameter
	return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
};
