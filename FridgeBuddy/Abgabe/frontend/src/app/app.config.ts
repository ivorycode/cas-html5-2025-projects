import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
	type ApplicationConfig,
	DEFAULT_CURRENCY_CODE,
	Injectable,
	LOCALE_ID,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
	provideRouter,
	RouterStateSnapshot,
	type Routes,
	TitleStrategy,
	withComponentInputBinding,
} from '@angular/router';
import { routeConfig } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const PAGE_TITLE = 'Fridge Buddy';

export const BASE_URL = 'https://fridge-buddies.onrender.com';

@Injectable()
export class SimpleTitleStrategy extends TitleStrategy {
	constructor(readonly title: Title) {
		super();
	}

	updateTitle(snapshot: RouterStateSnapshot): void {
		const pageTitle = this.buildTitle(snapshot);
		this.title.setTitle(
			pageTitle ? `${PAGE_TITLE} - ${pageTitle}` : `${PAGE_TITLE}`,
		);
	}
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(withInterceptors([authInterceptor])),
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(
			[...(Object.values(routeConfig) as Routes)],
			withComponentInputBinding(),
		),
		{ provide: LOCALE_ID, useValue: 'de-CH' },
		{
			provide: DATE_PIPE_DEFAULT_OPTIONS,
			useValue: { dateFormat: 'dd.MM.yyyy' },
		},
		{
			provide: DEFAULT_CURRENCY_CODE,
			useValue: 'CHF',
		},
		{ provide: TitleStrategy, useClass: SimpleTitleStrategy },
	],
};
