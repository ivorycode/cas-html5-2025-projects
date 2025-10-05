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

/*Defines Street Map Style*/
export const StreetMapStyle = {
  Streets: 0,
  Satellite: 1,
} as const;

export type StreetMapStyles = (typeof StreetMapStyle)[keyof typeof StreetMapStyle];
export const StreetMapOptionsMap = new Map([
  [StreetMapStyle.Streets, 'Strassen'],
  [StreetMapStyle.Satellite, 'Satelite'],
]);

export const StreetMapIconMap = new Map([
  [StreetMapStyle.Streets, 'pi pi-map'],
  [StreetMapStyle.Satellite, 'pi pi-globe'],
]);
