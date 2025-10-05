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

import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../../core/supabase-service';
import { ToastService } from '../../../core/toast-service';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'ii-navigation',
  templateUrl: './navigation.html',
  imports: [Toolbar, Button, Tooltip],
})
export class Navigation {
  // Services
  private _router: Router = inject(Router);
  private _toaster: ToastService = inject(ToastService);
  private _supabaseService: SupabaseService = inject(SupabaseService);

  // Internal Signals
  protected activePage = signal<string>('showDefects');

  protected async onShowDefects() {
    console.log('Navigate to show defects.');
    this.activePage.set('showDefects');
    await this._router.navigate(['home']);
  }

  protected async onCreateDefect() {
    console.log('Navigate to create defect.');
    this.activePage.set('createDefect');
    await this._router.navigate(['create-defect']);
  }

  protected async onAnalyseDefect() {
    console.log('Navigate to analyse defect.');
    this.activePage.set('analyseDefect');
    await this._router.navigate(['analyse-defect']);
  }

  protected async onLogout() {
    console.log('Navigate to logout.');
    this.activePage.set('logout');
    await this._router.navigate(['login']);
    await this._supabaseService.signOutUser();
    this._toaster.showSuccess('Benutzer wurde ausgeloggt');
  }
}
