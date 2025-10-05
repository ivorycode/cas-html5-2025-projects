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
import { Component, inject, input, model, output, signal } from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { AutoComplete, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { PlaceSuggestion } from '../../../core/models/Photon';
import { PhotonService } from '../../../core/photon-service';
import { Button } from 'primeng/button';

@Component({
  selector: 'ii-search-location',
  templateUrl: './search-location.html',
  imports: [
    IconField,
    InputIcon,
    FormsModule,
    AutoComplete,
    AutoCompleteModule,
    FormsModule,
    Button,
  ],
})
export default class SearchLocation {
  // Services
  private _photonService: PhotonService = inject(PhotonService);

  // Input/Outputs
  public fluid = input<boolean>();
  public placeChanged = output<PlaceSuggestion>();
  public placeReset = output<boolean>();

  // Internal Signals
  protected input = model<string | undefined>(undefined);
  protected results = signal<PlaceSuggestion[]>([]);

  protected onSearch(event: { query: string }): void {
    this._photonService.search(event.query).subscribe((suggestions: PlaceSuggestion[]) => {
      this.results.set(suggestions);
    });
  }

  protected onSelect(event: AutoCompleteSelectEvent): void {
    const place = event.value as PlaceSuggestion;
    console.log(`On Location Select: ${event.value}.`);
    console.log(`Selected place: ${place}.`);
    this.placeChanged.emit(place);
  }

  protected onPlaceReset(event: MouseEvent): void {
    console.log(`Placed rested: ${event.type}`);
    this.results.set([]);
    this.input.set(undefined);
    this.placeReset.emit(true);
  }
}
