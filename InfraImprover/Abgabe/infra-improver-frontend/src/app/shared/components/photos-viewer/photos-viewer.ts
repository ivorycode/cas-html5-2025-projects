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

import { Component, input } from '@angular/core';
import { GalleriaModule, GalleriaResponsiveOptions } from 'primeng/galleria';
import { Image } from 'primeng/image';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'ii-photos-viewer',
  templateUrl: './photos-viewer.html',
  imports: [GalleriaModule, Image, ProgressSpinner],
})
export default class PhotosViewer {
  public images = input.required<string[]>();
  public loading = input.required<boolean>();

  protected responsiveOptions: GalleriaResponsiveOptions[] = [
    {
      breakpoint: '1300px',
      numVisible: 5,
    },
    {
      breakpoint: '575px',
      numVisible: 2,
    },
  ];
}
