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
import { env } from '../../../environments/env';
import { Component, DestroyRef, effect, inject, input, model, output, signal } from '@angular/core';
import { DefectView } from '../../../core/models/Defect';
import {
  ControlComponent,
  FullscreenControlDirective,
  GeolocateControlDirective,
  MapComponent,
  NavigationControlDirective,
  ScaleControlDirective,
} from '@maplibre/ngx-maplibre-gl';
import {
  GeoJSONSource,
  GeolocateControl,
  LngLatBoundsLike,
  LngLatLike,
  Map,
  MapMouseEvent,
  StyleSpecification,
  RasterLayerSpecification,
  RasterSourceSpecification,
  MapGeoJSONFeature,
  AddLayerObject,
  SourceSpecification,
} from 'maplibre-gl';

import {
  StreetMapIconMap,
  StreetMapOptionsMap,
  StreetMapStyle,
  StreetMapStyles,
} from '../../../core/models/StreetMap';
import { SelectButton, SelectButtonChangeEvent } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { FeatureCollection } from 'geojson';
import { PostGISLocation, PostGISLocationBoundaries } from '../../../core/models/Location';
import { PlaceSuggestion } from '../../../core/models/Photon';
import { DrawerPosition, DrawerPositions } from '../../../core/models/Drawer';
import { Subject, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ii-street-map',
  templateUrl: './street-map.html',
  imports: [
    MapComponent,
    ControlComponent,
    FullscreenControlDirective,
    GeolocateControlDirective,
    NavigationControlDirective,
    ScaleControlDirective,
    SelectButton,
    FormsModule,
    PrimeTemplate,
  ],
})
export class StreetMap {
  // Map Settings
  private static STREET_MAP = 'https://api.maptiler.com/maps/ch-swisstopo-lbm/style.json?key=';
  private static SATELLITE_MAP = 'https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=';
  private static MARKER_LAYER = 'defect-marker-layer';
  private static MARKER_SOURCE = 'defect-marker-source';
  private static MARKER_ICON_NORMAL = 'defect-marker-icon';
  private static MARKER_ICON_SELECTED = 'defect-marker-icon-selected';

  private static DEFAULT_CENTER: LngLatLike = { lat: 8.1336, lng: 46.484 };
  private static SOUTH_WEST_LIMIT: LngLatLike = { lat: 45.764457, lng: -354.462891 };
  private static NORTH_WEST_LIMIT: LngLatLike = { lat: 47.898667, lng: -349.013672 };
  private static FLY_TO_Y_OFFSET = 0.0018;
  private static FLY_TO_X_OFFSET = 0.0045;
  private static FLY_TO_ZOOM = 16;

  // Services
  private _destroyRef = inject(DestroyRef);

  // Input/Output
  public defects = input.required<DefectView[]>();
  public drawer = input.required<DrawerPositions>();
  public place = input.required<PlaceSuggestion | undefined>();
  public summaryClosed = input.required<boolean>();
  public createdLocation = input<PostGISLocation>();

  public summaryOpen = output<DefectView>();
  public boundariesChanged = output<PostGISLocationBoundaries>();

  // Internal Signals
  protected style = model<StreetMapStyles | undefined>(undefined);
  protected mapStyle = signal<string | StyleSpecification>('');
  protected selectedMarkerIcon = signal<string | undefined>(undefined);
  protected trackUser = signal<boolean>(false);
  protected zoom = signal<[number]>([12]);
  protected center = signal<LngLatLike>(StreetMap.DEFAULT_CENTER);
  protected bound = signal<LngLatBoundsLike>([
    StreetMap.SOUTH_WEST_LIMIT,
    StreetMap.NORTH_WEST_LIMIT,
  ]);

  // Internal States
  private boundariesChangedThrottler = new Subject<PostGISLocationBoundaries>();
  protected readonly streetMapOptions: { icon: string; value: number }[] = Array.from(
    StreetMapOptionsMap.entries(),
  ).map(([value]) => ({
    value: value,
    icon: StreetMapIconMap.get(value) || '',
  }));
  protected map!: Map;

  public constructor() {
    // Initialize Map Style
    this.updateMapStyle(StreetMapStyle.Streets);

    // Trigger loading of markers when defect changed
    effect(() => {
      const defects = this.defects();
      if (this.map) {
        this.updateMarkers(defects);
      }
    });
    // Trigger change maker icon change when defect is selected
    effect(() => {
      const id = this.selectedMarkerIcon();
      this.updateSelectedMarkerIcon(id);
    });
    // Trigger change maker icon change when defect is unselected
    effect(() => {
      const closed = this.summaryClosed();
      if (closed) {
        this.updateUnselectedMarkerIcon();
        this.selectedMarkerIcon.set(undefined);
      }
    });
    // Trigger centered/zoom when placed changed
    effect(() => {
      const coords = this.place()?.coords;
      if (coords) {
        this.center.set([coords[1], coords[0]]);
        this.zoom.set([12]);
      }
    });
    // Boundary Change Throttler
    this.boundariesChangedThrottler
      .pipe(throttleTime(100), takeUntilDestroyed(this._destroyRef))
      .subscribe((boundaries) => {
        this.boundariesChanged.emit(boundaries);
      });
  }

  protected async onMapLoad(map: Map) {
    // Store map
    this.map = map;

    // Initialize Map Markers
    await this.initializeMarkers();

    // Add map callbacks
    this.map.on('click', StreetMap.MARKER_LAYER, (event) => this.onMarkerClicked(event));
    this.map.on('moveend', () => this.onMapMoved());
    this.map.on('styledata', async () => await this.initializeMarkers());

    if (!this.createdLocation()) {
      // Trigger Geolocation
      const geoLocateControl = this.map._controls.find((ctrl) => ctrl instanceof GeolocateControl);
      if (geoLocateControl) {
        geoLocateControl.trigger();
      }
    } else {
      const coords = this.createdLocation();
      console.log('Coords: ', coords);
      if (coords) {
        this.map.flyTo({
          center: [coords?.coordinates[1], coords?.coordinates[0]],
          zoom: 15,
          essential: true,
        });
      }
    }
  }

  protected onMapMoved() {
    // Enable Fly to user
    this.trackUser.set(true);
    // Update Boundary Box
    const bounds = this.map.getBounds();
    console.log(`Map has been moved ${this.map}`);
    this.boundariesChangedThrottler.next({
      southWestLat: bounds.getSouthWest().lat,
      southWestLng: bounds.getSouthWest().lng,
      northEastLat: bounds.getNorthEast().lat,
      northEastLng: bounds.getNorthEast().lng,
    });
  }

  protected onMarkerClicked(event: MapMouseEvent & { features?: MapGeoJSONFeature[] } & object) {
    if (!event.features || event.features.length === 0) {
      console.log('No features selected');
      return;
    }
    const clickedFeature = event.features[0];
    const defectId = clickedFeature.properties['id'];
    const defectView = this.defects().find((value) => value.id === defectId);
    if (!defectView) {
      console.error(`Could not select defect: ${defectId}`);
      return;
    }
    console.info(`Marker clicked: ${defectView.title}`);
    // Change Marker Icon
    this.selectedMarkerIcon.set(defectId);
    // Trigger open Summary
    this.summaryOpen.emit(defectView);
    // Trigger fly-to
    this.flyToDefect(defectView);
  }

  protected onMapStyleChange(event: SelectButtonChangeEvent) {
    console.log(`OnStyleChange: ${event.originalEvent}`);
    this.updateMapStyle(event.value);
  }

  private async initializeMarkers() {
    // Create map marker icons
    if (!this.map.hasImage(StreetMap.MARKER_ICON_NORMAL)) {
      const image = await this.map.loadImage('assets/marker-icon.png');
      this.map.addImage(StreetMap.MARKER_ICON_NORMAL, image.data);
    }
    if (!this.map.hasImage(StreetMap.MARKER_ICON_SELECTED)) {
      const image = await this.map.loadImage('assets/marker-selected-icon.png');
      this.map.addImage(StreetMap.MARKER_ICON_SELECTED, image.data);
    }
    // Create markers
    const source = this.map.getSource(StreetMap.MARKER_SOURCE) as GeoJSONSource;
    if (!source) {
      const newSource = this.createMarkerSource();
      this.map.addSource(StreetMap.MARKER_SOURCE, newSource);
    } else {
      this.updateMarkers(this.defects());
    }
    // Create layer
    const markerLayer = this.map.getLayer(StreetMap.MARKER_LAYER);
    if (!markerLayer) {
      const newMarkerLayer = this.createMarkerLayer();
      this.map.addLayer(newMarkerLayer);
    }
  }

  private updateMarkers(defect: DefectView[]) {
    if (!this.map) {
      console.log('Could not update Markers since map is not yet loaded');
      return;
    }
    const geoJson = this.createMarkerLocations(defect);
    const source = this.map.getSource(StreetMap.MARKER_SOURCE) as GeoJSONSource;
    if (source) {
      source.setData(geoJson);
    }
  }

  private updateSelectedMarkerIcon(id: string | undefined) {
    if (!this.map || !this.map.getLayer(StreetMap.MARKER_LAYER)) {
      console.log('Could not update selected marker icon since map is not yet loaded.');
      return;
    }
    console.log(`Update selected marker icon: ${id}.`);
    // Set selected icon
    this.map.setLayoutProperty(StreetMap.MARKER_LAYER, 'icon-image', [
      'case',
      ['==', ['get', 'id'], id],
      StreetMap.MARKER_ICON_SELECTED,
      StreetMap.MARKER_ICON_NORMAL,
    ]);
    // Set selected icon on top
    this.map.setLayoutProperty(StreetMap.MARKER_LAYER, 'symbol-sort-key', [
      'case',
      ['==', ['get', 'id'], id],
      1,
      0,
    ]);
  }

  private updateUnselectedMarkerIcon() {
    if (!this.map || !this.map.getLayer(StreetMap.MARKER_LAYER)) {
      console.log('Could not update unselected marker icon since map is not yet loaded.');
      return;
    }
    console.log(`Update unselected marker icons`);
    this.map.setLayoutProperty(StreetMap.MARKER_LAYER, 'icon-image', StreetMap.MARKER_ICON_NORMAL);
  }

  protected updateMapStyle(layerId: StreetMapStyles) {
    console.log(`Choose Street map style: ${layerId}`);
    switch (layerId) {
      case StreetMapStyle.Streets: {
        const style = this.createStreetMapStyle();
        this.mapStyle.set(style);
        break;
      }
      case StreetMapStyle.Satellite: {
        const style = this.createSatelliteStyle();
        this.mapStyle.set(style);
        break;
      }
      default: {
        console.error(`Unknown map style: ${layerId} was selected.`);
      }
    }
  }

  private flyToDefect(defectView: DefectView) {
    // Disable fly to user
    this.trackUser.set(false);
    // Check if current position is closer than fly to position
    const currentZoom = this.map.getZoom();
    if (currentZoom > StreetMap.FLY_TO_ZOOM) {
      console.info(`Do not fly to ${defectView.title} due to current zoom ${currentZoom}`);
      return;
    }
    // Fly to Defect
    const xOffset = this.drawer() === DrawerPosition.Right ? StreetMap.FLY_TO_X_OFFSET : 0;
    const yOffset = this.drawer() === DrawerPosition.Bottom ? StreetMap.FLY_TO_Y_OFFSET : 0;
    const longitude = defectView.location.coordinates[0] + xOffset;
    const latitude = defectView.location.coordinates[1] - yOffset;
    console.info(`Fly to ${defectView.title} : ${longitude} ${latitude}`);
    this.map.flyTo({
      center: [longitude, latitude],
      zoom: StreetMap.FLY_TO_ZOOM,
      pitch: 0,
      bearing: 0,
      essential: true,
    });
  }

  private createStreetMapStyle() {
    return StreetMap.STREET_MAP + env.maptilerKey;
  }

  private createSatelliteStyle() {
    const source = {
      type: 'raster',
      url: StreetMap.SATELLITE_MAP + env.maptilerKey,
    } as RasterSourceSpecification;

    const layer = {
      id: 'satellite',
      type: 'raster',
      source: 'raster',
    } as RasterLayerSpecification;

    return {
      version: 8,
      sources: {
        raster: source,
      },
      layers: [layer],
    } as StyleSpecification;
  }

  private createMarkerLayer() {
    return {
      id: StreetMap.MARKER_LAYER,
      type: 'symbol',
      source: StreetMap.MARKER_SOURCE,
      layout: {
        'icon-image': StreetMap.MARKER_ICON_NORMAL,
        'icon-size': 1,
        'icon-allow-overlap': true,
      },
    } as AddLayerObject;
  }

  private createMarkerSource() {
    const geoJson = this.createMarkerLocations(this.defects());
    return {
      type: 'geojson',
      data: geoJson,
    } as SourceSpecification;
  }

  private createMarkerLocations(defects: DefectView[]): FeatureCollection {
    return {
      type: 'FeatureCollection',
      features: defects.map((defect) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [defect.location?.coordinates[0], defect.location?.coordinates[1]],
        },
        properties: {
          id: defect.id,
          name: defect.title,
        },
      })),
    };
  }
}
