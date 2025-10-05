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

import { Component, inject, output, viewChild } from '@angular/core';
import { ToastService } from '../../../core/toast-service';
import { Button } from 'primeng/button';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';

@Component({
  selector: 'ii-photo-upload',
  templateUrl: './photo-upload.html',
  imports: [Button, FileUpload],
})
export class PhotoUpload {
  private static SIZE_NAME = 'KB';
  private static SIZE_K = 1024;

  // Services
  private _toaster: ToastService = inject(ToastService);

  // Input/Output
  public photos = output<File[]>();

  // Internal Signals
  private photoUpload = viewChild.required<FileUpload>('photoUpload');

  public clearPhotos(): void {
    console.log(`Clear all Photos`);
    this.photoUpload().clear();
  }

  protected onAddPhoto(event: MouseEvent, callback: () => void): void {
    console.log(`Choose Photo event: ${event.type}`);
    callback();
  }

  protected onRemovePhoto(
    event: Event,
    removeFileCallback: (event: Event, index: number) => void,
    index: number,
  ) {
    removeFileCallback(event, index);
  }

  protected async onPhotoUpload(event: FileUploadHandlerEvent): Promise<void> {
    if (!event.files?.length) {
      console.warn(`Could not upload photo since no files were selected.`);
      this._toaster.showWarning(`Es wurden keine Fotos ausgewählt`);
      return;
    }
    this.photos.emit(event.files);
  }

  protected formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return `0 ${PhotoUpload.SIZE_NAME}`;
    }
    const i = Math.floor(Math.log(bytes) / Math.log(PhotoUpload.SIZE_K));
    const formattedSize = parseFloat((bytes / Math.pow(PhotoUpload.SIZE_K, i)).toFixed(2));
    return `${formattedSize} ${PhotoUpload.SIZE_NAME}`;
  }
}
