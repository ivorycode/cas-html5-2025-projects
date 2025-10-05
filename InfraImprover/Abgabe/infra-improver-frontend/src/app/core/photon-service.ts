import { DestroyRef, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PhotonFeature, PhotonResponse, PlaceSuggestion } from './models/Photon';
import { env } from '../environments/env';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class PhotonService {
  // Services
  private http_ = inject(HttpClient);
  private _destroyRef = inject(DestroyRef);

  /**
   * Searches for locations via Photon and provides normalized suggestions.
   */
  public search(query: string, limit = 5, lang = 'de'): Observable<PlaceSuggestion[]> {
    return this.http_
      .get<PhotonResponse>(
        `${env.photonUrl}/api?q=${encodeURIComponent(query)}&limit=${limit}&lang=${lang}`,
      )
      .pipe(
        map((res) => this.createSuggestions(res.features)),
        takeUntilDestroyed(this._destroyRef),
      );
  }

  reverseToLabel(
    lat: number | undefined,
    lon: number | undefined,
    lang = 'de',
  ): Observable<string> {
    return this.http_
      .get<PhotonResponse>(`${env.photonUrlReverse}?lat=${lat}&lon=${lon}&lang=${lang}&limit=1`)
      .pipe(
        map((res) => {
          const first = res.features[0];
          return first ? this.buildLabel(first) : 'Unbekannter Ort';
        }),
        takeUntilDestroyed(this._destroyRef),
      );
  }

  /**
   * Convert PhotonFeature[] to PlaceSuggestion[] .
   */
  private createSuggestions(features: PhotonFeature[]): PlaceSuggestion[] {
    return features.map(
      (feature: PhotonFeature): PlaceSuggestion => ({
        label: this.buildLabel(feature),
        coords: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]], // [lat, lon]
      }),
    );
  }

  /**
   * Generates human-readable labels from PhotonProperties.
   */
  private buildLabel(feature: PhotonFeature): string {
    const p = feature.properties;
    if (p.street && p.housenumber) {
      return `${p.street} ${p.housenumber}, ${p.postcode ?? ''} ${p.city ?? ''}`.trim();
    }
    if (p.street) return `${p.street}, ${p.city ?? ''}`.trim();
    if (p.city && p.postcode) return `${p.postcode} ${p.city}, ${p.country ?? ''}`.trim();
    if (p.city) return `${p.city}, ${p.country ?? ''}`.trim();
    return p.name ?? p.country ?? 'Unbekannter Ort';
  }
}
