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

import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { CommonModule, DatePipe } from '@angular/common';
import {
  DefectState,
  DefectStateMap,
  DefectStates,
  DefectStateSeverityMap,
} from '../../../core/models/DefectState';
import { DefectView } from '../../../core/models/Defect';
import {
  DefectCategories,
  DefectCategory,
  DefectCategoryMap,
} from '../../../core/models/DefectCategory';
import { from, mergeMap, of, tap, toArray } from 'rxjs';
import { PhotonService } from '../../../core/photon-service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Select } from 'primeng/select';
import { SelectItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'ii-defect-table',
  templateUrl: './defect-table.html',
  imports: [
    TableModule,
    Tag,
    DatePipe,
    ProgressSpinner,
    CommonModule,
    Select,
    FormsModule,
    ButtonModule,
    Ripple,
    RouterLink,
    RouterModule,
  ],
})
export class DefectTable {
  // Services
  private _photonService = inject(PhotonService);
  private _destroyRef = inject(DestroyRef);

  // Input/Output
  public defects = input.required<DefectView[]>();
  public editDefect = output<DefectView>();

  // Internal Signals
  protected totalRecords = computed(() => this.defects().length);
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
  protected locationLabels = new Map<number, string>();
  protected statesOptions: SelectItem[] = Array.from(DefectStateMap.entries()).map(
    ([key, label]) => ({
      label: label,
      value: key,
    }),
  );
  protected loading = false;
  protected pageSize = 5;

  public constructor() {
    // Trigger location loading when defects changed
    effect(() => {
      const defects = this.defects();
      if (defects.length) {
        this.loadLocationLabel();
      }
    });
  }

  protected onRowEditInit(defect: DefectView) {
    if (defect) {
      this.defectCopy.set({ ...(defect as DefectView) });
      console.log(`Editing started for defect: ${defect}`);
    }
  }

  protected onRowEditSave(defect: DefectView) {
    console.log(`Saved defect: id=${defect.id}`);
    this.editDefect.emit(defect);
  }

  protected onRowEditCancel(defect: DefectView) {
    const original = this.defectCopy();
    if (original) {
      defect.state = original.state; // only state is editable
    }
    console.log(`Edit cancelled for defect id=${defect.id}`);
  }

  protected getDefectCategoryText(category: DefectCategories | undefined): string | undefined {
    return DefectCategoryMap.get(category || DefectCategory.Undefined) ?? undefined;
  }

  protected getDefectStateText(state: DefectStates | undefined): string | undefined {
    return DefectStateMap.get(state || DefectState.Open) ?? undefined;
  }

  protected getDefectStateSeverity(state: DefectStates): string | undefined {
    return DefectStateSeverityMap.get(state || DefectState.Open) ?? undefined;
  }

  protected loadLocationLabel() {
    this.loading = true;
    from(this.defects())
      .pipe(
        mergeMap(
          (d) => {
            if (!d.location) return of('–');
            if (this.locationLabels.has(d.id!)) return of(this.locationLabels.get(d.id!)!);
            const [lon, lat] = d.location.coordinates;
            return this._photonService
              .reverseToLabel(lat, lon)
              .pipe(tap((label) => this.locationLabels.set(d.id!, label)));
          },
          3, // max parallel requests
        ),
        takeUntilDestroyed(this._destroyRef),
        toArray(),
      )
      .subscribe({
        next: () => (this.loading = false),
        error: () => (this.loading = false),
      });
  }
}
