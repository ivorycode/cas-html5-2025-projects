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

/*Defines Date Structure of PostGIS Location */
export interface PostGISLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}
export interface PostGISLocationWithRadius {
  coordinates: [number, number]; // [longitude, latitude]
  radius_in_meters: number;
}
export interface PostGISLocationBoundaries {
  southWestLat: number;
  southWestLng: number;
  northEastLat: number;
  northEastLng: number;
}

/*Defines Location Options */
export const LocationOption = {
  GPS: 1,
  Photo: 2,
  Search: 3,
} as const;

export const LocationOptionsMap = new Map([
  [LocationOption.GPS, 'GPS'],
  [LocationOption.Photo, 'Foto'],
  [LocationOption.Search, 'Ortssuche'],
]);
export const LocationOptionsIconMap = new Map([
  [LocationOption.GPS, 'pi pi-map-marker'],
  [LocationOption.Photo, 'pi pi-camera'],
  [LocationOption.Search, 'pi pi-search'],
]);
