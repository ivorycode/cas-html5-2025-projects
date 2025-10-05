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

import { Injectable } from '@angular/core';
import * as ExifReader from 'exifreader';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  public async getGpsPositionFromPhoto(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const tags = ExifReader.load(arrayBuffer);
    const latitude = tags['GPSLatitude']?.description;
    const longitude = tags['GPSLongitude']?.description;
    if (!latitude || !longitude) {
      throw new Error('Invalid latitude and longitude');
    }
    return { longitude: Number(longitude), latitude: Number(latitude) };
  }

  public getGpsCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject): void => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported by browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition): void => {
          console.log(
            `Get current Position from ${position.coords.longitude}/${position.coords.latitude}.`,
          );
          resolve(position);
        },
        (error: GeolocationPositionError): void => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // time to fetch location in browser, on timeout error is called
          maximumAge: 0,
        },
      );
    });
  }
}
