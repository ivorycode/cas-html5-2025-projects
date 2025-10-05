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

import { Component, input, output, signal, effect } from '@angular/core';
import { DefectView } from '../../../core/models/Defect';
import {
  DefectCategories,
  DefectCategory,
  DefectCategoryMap,
} from '../../../core/models/DefectCategory';
import { DefectState, DefectStateMap, DefectStates } from '../../../core/models/DefectState';
import PhotosViewer from '../../../shared/components/photos-viewer/photos-viewer';
import { ScrollPanel } from 'primeng/scrollpanel';
import { BadgeModule } from 'primeng/badge';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IftaLabel } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { Message } from 'primeng/message';
import { SelectItem } from 'primeng/api';
import { Select } from 'primeng/select';
import { PhotoUpload } from '../../../shared/components/photo-upload/photo-upload';

@Component({
  selector: 'ii-show-defect-detail',
  templateUrl: './show-defect-detail.html',
  imports: [
    PhotosViewer,
    BadgeModule,
    ScrollPanel,
    BadgeModule,
    FormsModule,
    ReactiveFormsModule,
    InputText,
    TextareaModule,
    IftaLabel,
    ReactiveFormsModule,
    FileUploadModule,
    Message,
    Select,
    PhotoUpload,
  ],
})
export default class ShowDefectDetail {
  // Inputs/Outputs
  public defect = input.required<DefectView | undefined>();
  public images = input.required<string[]>();
  public imagesLoading = input.required<boolean>();
  public isVoted = input.required<boolean>();
  public isEditable = input.required<boolean>();
  public saveRequested = input.required<boolean>();

  public uploadedPhotos = output<File[]>();
  public defectToSave = output<DefectView>();
  public votesClicked = output<boolean>();

  // Internal Signals
  protected validationFailed = signal<boolean>(false);
  protected defectCopy = signal<DefectView>({
    id: 0,
    user_id: undefined,
    title: '',
    category: DefectCategory.Undefined,
    description: '',
    numberOfVotes: 0,
    state: DefectState.Open,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    location: {
      type: 'Point',
      coordinates: [0, 0],
    },
    photos: [],
  });

  // Internal States
  protected defectForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', Validators.required),
    state: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    location: new FormControl({ value: '', disabled: true }),
  });

  protected categoryOptions: SelectItem[] = Array.from(DefectCategoryMap.entries()).map(
    ([key, label]) => ({
      label: label,
      value: key,
    }),
  );

  public constructor() {
    effect(() => {
      if (this.saveRequested()) {
        this.onSave();
      } else {
        this.onCancel();
      }
    });
  }

  protected getDefectCategoryText(category: DefectCategories | undefined): string | undefined {
    return DefectCategoryMap.get(category || DefectCategory.Undefined) ?? undefined;
  }

  protected getDefectStateText(state: DefectStates | undefined): string | undefined {
    return DefectStateMap.get(state || DefectState.Open) ?? undefined;
  }

  protected onDefectVoteClicked(event: MouseEvent | Event) {
    console.log(`Clicked on votes of ${this.defect()?.title} with event ${event.type}.`);
    this.votesClicked.emit(!this.isVoted());
  }

  protected onPhotoUpload(files: File[]) {
    console.log(`${files.length} photo were selected`);
    this.uploadedPhotos.emit(files);
  }

  private onSave() {
    if (!this.defectForm.valid) {
      console.error(`Cancel save: ${this.defect()?.title}`);
      return;
    }
    console.log(`Save ${this.defect()?.title}`);
    const updated: DefectView = {
      ...this.defect(),
      ...this.defectForm.value,
    };
    this.defectToSave.emit(updated);
  }

  private onCancel() {
    console.info(`Cancel ${this.defect()?.title}`);
    const defect = this.defect();
    if (defect) {
      this.defectCopy.set({ ...defect });
      this.defectForm.patchValue({
        title: defect.title,
        category: defect.category,
        state: defect.state,
        description: defect.description,
        location: defect.location,
      });
    }
  }
}
