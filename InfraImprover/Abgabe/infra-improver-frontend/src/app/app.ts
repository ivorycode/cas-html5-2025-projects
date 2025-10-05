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

import { Component, inject } from '@angular/core';
import { SupabaseService } from './core/supabase-service';
import { Router, RouterOutlet } from '@angular/router';
import { Navigation } from './shared/components/navigation/navigation';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'ii-app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet, Navigation, Toast],
})
export class App {
  private readonly supabase: SupabaseService = inject(SupabaseService);
  private router = inject(Router);
  private _isLoggedIn = false;

  public constructor() {
    this.supabase.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      this.onAuthStateChangeCallback(event, session);
    });
  }

  private onAuthStateChangeCallback(event: AuthChangeEvent, session: Session | null) {
    this._isLoggedIn = session !== null && session?.user !== null;
  }

  protected isLoggedIn() {
    return this._isLoggedIn;
  }
  protected isUserAuthentication() {
    return this.router.url.startsWith('/login');
  }
}
