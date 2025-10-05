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

import { Component, DestroyRef, inject, model, output, signal } from '@angular/core';
import SearchLocation from '../../../shared/components/search-location/search-location';
import { PlaceSuggestion } from '../../../core/models/Photon';
import { PostGISLocationWithRadius } from '../../../core/models/Location';
import { FormsModule } from '@angular/forms';
import { Slider, SliderChangeEvent } from 'primeng/slider';
import { debounceTime, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ii-defect-location-filter',
  templateUrl: './defect-location-filter.html',
  imports: [SearchLocation, FormsModule, Slider],
})
export class DefectLocationFilter {
  // Services
  private _destroyRef = inject(DestroyRef);

  // Input/Output
  public filterChanged = output<PostGISLocationWithRadius>();
  public filterReset = output<boolean>();

  // Internal Signals
  protected place = signal<PlaceSuggestion | undefined>(undefined);
  protected radiusKm = model<number>(15);

  // Internal States
  private boundariesChangedThrottler = new Subject<PostGISLocationWithRadius>();

  public constructor() {
    this.boundariesChangedThrottler
      .pipe(debounceTime(1000), takeUntilDestroyed(this._destroyRef))
      .subscribe((boundaries) => {
        this.filterChanged.emit(boundaries);
      });
  }

  protected onPlaceChange(event: PlaceSuggestion | undefined) {
    console.log(`Place changed: ${event?.label}`);
    this.place.set(event);
    this.updateBoundariesChanged();
  }

  protected onPlaceReset() {
    console.log(`Place reset.}`);
    this.place.set(undefined);
    this.filterReset.emit(true);
  }

  protected onDistanceChange(event: SliderChangeEvent) {
    console.log(`Distance changed: ${event.value}`);
    this.updateBoundariesChanged();
  }

  private updateBoundariesChanged() {
    const coords = this.place()?.coords;
    if (!coords) {
      console.warn('No coords for place found!');
      return;
    }

    this.boundariesChangedThrottler.next({
      coordinates: [coords[0], coords[1]],
      radius_in_meters: this.radiusKm() * 1000,
    });
  }
}
