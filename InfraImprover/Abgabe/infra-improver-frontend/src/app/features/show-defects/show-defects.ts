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
import { Component, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../../core/supabase-service';
import { StreetMap } from '../../shared/components/street-map/street-map';
import { DefectView } from '../../core/models/Defect';
import { GalleriaModule } from 'primeng/galleria';
import { StreetMapDrawer } from '../../shared/components/street-map-drawer/street-map-drawer';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import SearchLocation from '../../shared/components/search-location/search-location';
import ShowDefectDetail from './show-defect-detail/show-defect-detail';
import { ToastService } from '../../core/toast-service';
import { PostGISLocation, PostGISLocationBoundaries } from '../../core/models/Location';
import { PlaceSuggestion } from '../../core/models/Photon';
import { DrawerPosition, DrawerPositions } from '../../core/models/Drawer';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ii-show-all-defects',
  templateUrl: './show-defects.html',
  imports: [
    StreetMap,
    GalleriaModule,
    StreetMapDrawer,
    FormsModule,
    AutoCompleteModule,
    FormsModule,
    SearchLocation,
    ShowDefectDetail,
  ],
})
export default class ShowDefects implements OnInit {
  // Services
  private _supabase: SupabaseService = inject(SupabaseService);
  private _toaster: ToastService = inject(ToastService);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  // Internal Signals
  protected defects = signal<DefectView[]>([]);
  protected selectedDefect = signal<DefectView | undefined>(undefined);
  protected drawerPosition = signal<DrawerPositions>(DrawerPosition.Bottom);
  protected createdLocation = signal<PostGISLocation | undefined>(undefined);
  protected selectedPlace = signal<PlaceSuggestion | undefined>(undefined);
  protected selectedImages = signal<string[]>([]);
  protected selectedImagesLoading = signal<boolean>(false);
  protected newUploadedImagesForDefect = signal<File[]>([]);
  protected showDefectSummary = signal<boolean>(false);
  protected hasVotedForSelectedDefect = signal<boolean>(false);
  protected canEditDefect = signal(false);
  protected isInEditMode = signal(false);
  protected isSelectedDone = signal<boolean>(false);
  protected isSelectedDeleted = signal<boolean>(false);
  protected saveRequested = signal<boolean>(false);
  protected defectBoundaries = signal<PostGISLocationBoundaries>({
    southWestLat: 50.0,
    southWestLng: 7.0,
    northEastLat: 40.0,
    northEastLng: 8.0,
  });

  public async ngOnInit() {
    const defects = (await this._supabase.getDefectsInView(this.defectBoundaries())) ?? [];
    this.defects.set(defects);

    const latQueryParam = this._route.snapshot.queryParamMap.get('lat');
    const longQueryParam = this._route.snapshot.queryParamMap.get('long');
    if (latQueryParam && longQueryParam) {
      const lat = Number(latQueryParam);
      const long = Number(longQueryParam);
      this.createdLocation.set({
        coordinates: [long, lat],
        type: 'Point',
      });
    }
  }

  protected onDrawerPositionChanged(event: DrawerPositions) {
    console.log(`Drawer position Changed: ${event}`);
    this.drawerPosition.set(event);
  }

  protected onPlaceChange(event: PlaceSuggestion | undefined) {
    console.log(`Placed changed: ${event?.label}`);
    this.selectedPlace.set(event);
  }

  protected onPlaceReset() {
    console.log(`Placed rested`);
    this.selectedPlace.set(undefined);
  }

  protected async onBoundariesChange(boundary: PostGISLocationBoundaries) {
    console.log(
      `Boundaries changed: ${boundary.northEastLat}, ${boundary.northEastLng} / ${boundary.southWestLat}, ${boundary.northEastLat}`,
    );
    const defects = await this._supabase.getDefectsInView(boundary);
    this.defectBoundaries.set(boundary);
    this.defects.set(defects);
  }

  protected async onSummaryOpen(defect: DefectView) {
    console.log(`Open Defect Summary of: ${defect.title} votes: ${defect.numberOfVotes}`);
    this.selectedDefect.set(defect);
    this.showDefectSummary.set(true);

    // Check if user has already voted or not - if yes he is not allowed anymore
    const userId = (await this._supabase.getUser()).data.user?.id;
    const votedForSelectedDefect = !(await this._supabase.canUpVote({
      defect_id: defect.id,
      user_id: userId,
    }));
    this.hasVotedForSelectedDefect.set(votedForSelectedDefect);

    // If user has created defect he is allowed to edit the defect
    const selectedId = this.selectedDefect()?.id;
    if (selectedId) {
      const canEditDefect = await this._supabase.canEditDefect(selectedId, userId!);
      this.canEditDefect.set(canEditDefect);
    }
    await this.loadImages(defect);
  }

  protected onSummaryClose(event: MouseEvent) {
    console.log(`Close Defect Summary of: ${event.type}`);
    this.closeDetail();
  }

  protected async onDefectDelete() {
    console.log(`Delete Defect : ${this.selectedDefect()?.title}`);
    const defectId = this.selectedDefect()?.id;
    const userId = (await this._supabase.getUser()).data.user?.id;
    if (await this._supabase.deleteDefect(defectId!, userId!)) {
      this._toaster.showSuccess('Löschen der Schadensmeldung war erfolgreich!');
      this.isSelectedDeleted.set(true);
      this.closeDetail();
    }
  }

  protected async onDefectVoted(voted: boolean) {
    console.log(`On Votes Clicked: ${voted}`);
    const defectId = this.selectedDefect()?.id;
    const userId = (await this._supabase.getUser()).data.user?.id;
    if (voted) {
      await this._supabase.upVote({ user_id: userId, defect_id: defectId });
      this.hasVotedForSelectedDefect.set(true);
      const defect = this.selectedDefect();
      if (defect) {
        this.selectedDefect.set({ ...defect, numberOfVotes: defect.numberOfVotes + 1 });
      }
    } else {
      await this._supabase.downVote({ user_id: userId, defect_id: defectId });
      this.hasVotedForSelectedDefect.set(false);
      const defect = this.selectedDefect();
      if (defect) {
        this.selectedDefect.set({ ...defect, numberOfVotes: defect.numberOfVotes - 1 });
      }
    }
  }

  protected onEditRequestedClicked(event: MouseEvent) {
    console.log(`Edit Dialog Visible  ${event.type}`);
    this.isInEditMode.set(!this.isInEditMode());
  }

  protected onSaveRequestedClicked(event: MouseEvent) {
    console.log(`On Save Request Clicked ${event.type}`);
    this.saveRequested.set(true);
  }

  protected async onDefectSave(defect: DefectView) {
    console.log(`Change defect: ${defect.title}`);
    const defectId = this.selectedDefect()?.id;
    if (defectId) {
      const updatedDefect = await this._supabase.updateDefect(defectId, defect);
      if (updatedDefect) {
        for (const photo of this.newUploadedImagesForDefect()) {
          console.log('uploading photo ' + photo);
          await this._supabase.uploadPhotoOfDefect(updatedDefect, photo);
        }
        const newDefects = this.defects().map((d) => (d?.id === defectId ? updatedDefect : d));
        this.defects.set(newDefects);
        this.selectedDefect.set(updatedDefect);
        this._toaster.showSuccess('Editieren der Schadensmeldung war erfolgreich!');
      }
    }
    this.saveRequested.set(false);
    this.closeDetail();
  }

  private closeDetail() {
    this.showDefectSummary.set(false);
    this.selectedDefect.set(undefined);
    this.selectedImages.set([]);
    this.hasVotedForSelectedDefect.set(false);
    this.isSelectedDone.set(false);
    this.isSelectedDeleted.set(false);
    this.canEditDefect.set(false);
    this.isInEditMode.set(false);
    this.newUploadedImagesForDefect.set([]);
  }

  private async loadImages(defect: DefectView) {
    this.selectedImages.set([]);
    try {
      this.selectedImagesLoading.set(true);
      const urls = await this._supabase.getImagePaths(defect);
      for (const url of urls) {
        const image = await this._supabase.getImage(defect, url);
        this.selectedImages.set([...this.selectedImages(), image]);
      }
    } finally {
      this.selectedImagesLoading.set(false);
    }
  }

  protected onUploadedPhotos(files: File[]) {
    this.newUploadedImagesForDefect.set(files);
  }
}
