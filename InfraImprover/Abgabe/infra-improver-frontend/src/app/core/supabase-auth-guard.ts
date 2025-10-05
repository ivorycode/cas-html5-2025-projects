/*
_____          __                       _____
|_   _|        / _|                     |_   _|
 | |   _ __  | |_  _ __   __ _  ______   | |   _ __ ___   _ __   _ __   ___  __   __  ___  _ __
 | |  | '_ \ |  _|| '__| / _` ||______|  | |  | '_ ` _ \ | '_ \ | '__| / _ \ \ \ / / / _ \| '__|
 | |_ | | | || |  | |   | (_| |         _| |_ | | | | | || |_) || |   | (_) | \ V / |  __/| |
 \___/ |_| |_||_|  |_|    \__,_|         \___/ |_| |_| |_|| .__/ |_|    \___/   \_/   \___||_|
                                                          | |
                                                          |_|
  Copyright @Beat Weisskopf, Sandrine Ngo-Dinh, Yves Jegge
*/

import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { SupabaseService } from './supabase-service';

export const SupabaseAuthGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<boolean> => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
  const isUserSignIn = supabaseService.isUserSignIn();
  if (!isUserSignIn) {
    console.log(`Could not route to ${state.url}, since user is not sign-in, redirect to login.`);
    await router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  console.log(`Route to ${state.url}.`);
  return true;
};
