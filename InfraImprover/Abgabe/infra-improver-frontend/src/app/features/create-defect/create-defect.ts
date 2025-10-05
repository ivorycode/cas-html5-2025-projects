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

import { Component, inject, OnInit, signal, viewChild } from '@angular/core';

import { SupabaseService } from '../../core/supabase-service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { IftaLabel } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';
import { LocationService } from '../../core/location-service';
import {
  DefectCategories,
  DefectCategory,
  DefectCategoryMap,
  DefectCategoryReverseMap,
} from '../../core/models/DefectCategory';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../core/toast-service';
import { DefectInsert } from '../../core/models/Defect';
import { Tooltip } from 'primeng/tooltip';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { DefectState } from '../../core/models/DefectState';
import { PhotoUpload } from '../../shared/components/photo-upload/photo-upload';
import {
  LocationOption,
  LocationOptionsIconMap,
  LocationOptionsMap,
  PostGISLocation,
} from '../../core/models/Location';
import { SelectButton, SelectButtonChangeEvent } from 'primeng/selectbutton';
import { PhotonService } from '../../core/photon-service';
import { PlaceSuggestion } from '../../core/models/Photon';
import SearchLocation from '../../shared/components/search-location/search-location';
import { Router } from '@angular/router';

@Component({
  selector: 'ii-create-defect',
  templateUrl: './create-defect.html',
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    InputText,
    TextareaModule,
    IftaLabel,
    ReactiveFormsModule,
    FileUploadModule,
    Tooltip,
    Message,
    Select,
    PhotoUpload,
    SelectButton,
    SearchLocation,
  ],
})
export default class CreateDefect implements OnInit {
  private _supabase: SupabaseService = inject(SupabaseService);
  private _toaster: ToastService = inject(ToastService);
  private _locationService: LocationService = inject(LocationService);
  private _photonService: PhotonService = inject(PhotonService);
  private _router: Router = inject(Router);

  // Internal Signals
  protected photos = signal<File[]>([]);
  protected photoUpload = viewChild<PhotoUpload>('photoUpload');
  protected isCreatingDefect = signal<boolean>(false);
  protected isSearchEnabled = signal<boolean>(false);
  protected validationFailed = signal<boolean>(false);
  protected categoriesOptions = signal<string[]>([]);
  protected location = signal<PostGISLocation | undefined>(undefined);
  protected locationOptions = signal<{ name: string; value: number; icon: string }[]>([]);

  // Internal States
  protected defectForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', Validators.required),
    category: new FormControl('', [Validators.required]),
    locationChooser: new FormControl('', [Validators.required]),
    locationLabel: new FormControl({ value: '', disabled: true }),
  });

  public async ngOnInit() {
    const categories = await this._supabase.getCategories();
    console.log(categories);
    const categoriesOptions = categories.map((category) => DefectCategoryMap.get(category) ?? '');
    console.log(categoriesOptions);
    this.categoriesOptions.set(categoriesOptions);

    const locations = Object.values(LocationOption);
    const locationOptions = locations.map((value) => ({
      name: LocationOptionsMap.get(value) || '',
      value: value,
      icon: LocationOptionsIconMap.get(value) || '',
    }));
    this.locationOptions.set(locationOptions);
  }

  protected onPhotoUpload(files: File[]) {
    console.log(`${files.length} photo were selected`);
    this.photos.set(files);
  }

  protected onPlaceChange(event: PlaceSuggestion) {
    console.log(`Placed changed: ${event.label}`);
    const location = {
      type: 'Point',
      coordinates: [event?.coords[1], event?.coords[0]],
    } as PostGISLocation;
    console.log(location);
    this.location.set(location);
    this.updateReverseGeoLocation();
  }

  protected onPlaceReset() {
    console.log(`Placed rested`);
    this.location.set(undefined);
    this.defectForm.get('locationLabel')?.setValue('');
  }

  protected async onLocationOptionChange(event: SelectButtonChangeEvent) {
    console.log(`On Location Option Change ${event.value}`);
    switch (event?.value) {
      case LocationOption.GPS: {
        console.log(`Choose Location search with GPS.`);
        this.isSearchEnabled.set(false);
        const location = await this.createGpsLocationFromWebApi();
        this.location.set(location);
        if (!location) {
          this._toaster.showWarning('GPS-Postion konnte nicht ermittelt werden.');
        }
        this.updateReverseGeoLocation();
        break;
      }
      case LocationOption.Photo: {
        console.log(`Choose Location search with Photos.`);
        this.isSearchEnabled.set(false);
        if (this.photos().length === 0) {
          this._toaster.showWarning('Bitte fügen  sie zuerst Bilder hinzu.');
          return;
        }
        const location = await this.createGpsLocationFromPhotos();
        this.location.set(location);
        if (!location) {
          this._toaster.showWarning('GPS Position konnte nicht aus den Bildern ermittelt werden.');
        }
        this.updateReverseGeoLocation();
        break;
      }
      case LocationOption.Search: {
        console.log(`Choose manual Location search.`);
        this.isSearchEnabled.set(true);
        break;
      }
      default:
        this.isSearchEnabled.set(false);
        console.error(`Unknown location option ${event.value} was selected.`);
    }
  }

  protected async onSubmitDefect() {
    if (this.defectForm.invalid || this.photos().length === 0 || !this.location()) {
      this.validationFailed.set(true);
      console.warn('Create defect failed, since form was invalid.');
      return;
    }
    this.validationFailed.set(false);
    this.isCreatingDefect.set(true);
    try {
      const defect = await this.createDefect();
      const created = await this._supabase.createDefect(defect);
      for (const photo of this.photos()) {
        console.log(photo);
        await this._supabase.uploadPhotoOfDefect(created, photo);
      }
      this.defectForm.reset();
      this.photos.set([]);
      this.photoUpload()?.clearPhotos();
      await this._router.navigate(['/home'], {
        queryParams: {
          lat: this.location()?.coordinates[0],
          long: this.location()?.coordinates[1],
        },
      });
      this.location.set(undefined);
      this._toaster.showSuccess('Erstellen der Schadensmeldung war erfolgreich!');
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        this._toaster.showWarning(error.message);
      }
    } finally {
      this.isCreatingDefect.set(false);
    }
  }

  private async createDefect(): Promise<DefectInsert> {
    const user = await this._supabase.getUser();
    const userData = user.data.user;
    if (!userData) {
      throw new Error('Es konnten keine Benutzer Daten gefunden werden.');
    }
    const user_id = userData.id;
    const title = this.defectForm.value.title;
    const category = this.createCategory();
    const description = this.defectForm.value.description;
    console.log(
      `Create Defect for User: ${user}, ${title}, ${category}, ${description}, ${this.location()}`,
    );
    return {
      user_id: user_id,
      title: title,
      category: category,
      description: description,
      location: this.location(),
      state: DefectState.Open,
    } as DefectInsert;
  }

  protected updateReverseGeoLocation(): void {
    this._photonService
      .reverseToLabel(this.location()?.coordinates[1], this.location()?.coordinates[0])
      .subscribe((value) => this.defectForm.get('locationLabel')?.setValue(value));
  }

  private async createGpsLocationFromWebApi(): Promise<PostGISLocation | undefined> {
    try {
      const position = await this._locationService.getGpsCurrentPosition();
      console.log(
        `Found GPS from Web-APi: ${position.coords.longitude}, ${position.coords.latitude}`,
      );
      return {
        type: 'Point',
        coordinates: [position.coords.longitude, position.coords.latitude],
      } as PostGISLocation;
    } catch (error) {
      console.warn(`Could not determine GPS Position from web-api: ${error}`);
      return undefined;
    }
  }

  private async createGpsLocationFromPhotos(): Promise<PostGISLocation | undefined> {
    for (const photo of this.photos()) {
      const locationFromPhotos = await this.createGpsLocationFromPhoto(photo);
      if (locationFromPhotos) {
        return locationFromPhotos;
      }
    }
    return undefined;
  }

  private async createGpsLocationFromPhoto(file: File): Promise<PostGISLocation | undefined> {
    try {
      const position = await this._locationService.getGpsPositionFromPhoto(file);
      console.log(`Found GPS from Photos: ${position.longitude}, ${position.latitude}`);
      return {
        type: 'Point',
        coordinates: [position.longitude, position.latitude],
      } as PostGISLocation;
    } catch (error) {
      console.warn(`Could not determine GPS Position from photo ${file}: ${error}`);
      return undefined;
    }
  }

  private createCategory(): DefectCategories {
    const categoryEnum = DefectCategoryReverseMap.get(this.defectForm.value.category);
    return categoryEnum || DefectCategory.Undefined;
  }
}
