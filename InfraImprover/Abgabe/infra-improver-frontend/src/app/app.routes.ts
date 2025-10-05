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

import { Routes } from '@angular/router';
import { SupabaseAuthGuard } from './core/supabase-auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/user-authentication/user-login-in'),
  },
  {
    path: 'login/signup',
    loadComponent: () => import('./features/user-authentication/user-sign-up/user-sign-up'),
  },
  {
    path: 'login/restore',
    loadComponent: () =>
      import('./features/user-authentication/user-restore-password/user-restore-password'),
  },
  {
    path: 'login/reset-password',
    loadComponent: () =>
      import('./features/user-authentication/user-reset-password/user-reset-password'),
  },
  {
    path: 'home',
    loadComponent: () => import('./features/show-defects/show-defects'),
    canActivate: [SupabaseAuthGuard],
  },
  {
    path: 'create-defect',
    loadComponent: () => import('./features/create-defect/create-defect'),
    canActivate: [SupabaseAuthGuard],
  },
  {
    path: 'analyse-defect',
    loadComponent: () => import('./features/analyse-defects/analyse-defect'),
    canActivate: [SupabaseAuthGuard],
  },
];
