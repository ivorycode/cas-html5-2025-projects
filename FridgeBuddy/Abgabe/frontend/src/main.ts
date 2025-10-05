import { registerLocaleData } from '@angular/common';
import localeDeCh from '@angular/common/locales/de-CH';
import localeDeChExtra from '@angular/common/locales/extra/de-CH';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

registerLocaleData(localeDeCh, 'de-CH', localeDeChExtra);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
