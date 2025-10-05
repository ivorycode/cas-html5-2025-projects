import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { TitleService } from './services/ui/title.service';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Header],
	templateUrl: './app.html',
})
export class App {
	titleService = inject(TitleService);
}
