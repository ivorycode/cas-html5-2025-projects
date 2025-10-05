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

import { Component, input, model, output, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DefectView } from '../../../core/models/Defect';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DrawerPosition, DrawerPositions } from '../../../core/models/Drawer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ii-street-map-drawer',
  templateUrl: './street-map-drawer.html',
  standalone: true,
  imports: [Button, Drawer, ConfirmDialogModule, ConfirmPopupModule, DialogModule, FormsModule],
  providers: [ConfirmationService],
})
export class StreetMapDrawer implements OnInit {
  // Services
  private _confirmationService: ConfirmationService = inject(ConfirmationService);
  private _destroyRef: DestroyRef = inject(DestroyRef);
  private _breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  // Inputs/Outputs
  public defect = input<DefectView | undefined>(undefined);
  public isDone = input<boolean>(false);
  public isEditable = input<boolean>();
  public isInEditMode = input<boolean>();
  public visible = model<boolean>(true);

  public position = output<DrawerPositions>();
  public editClicked = output<MouseEvent>();
  public saveClicked = output<MouseEvent>();
  public closeClicked = output<MouseEvent>();
  public deleteClicked = output<boolean>();

  // Internal Signals
  protected drawerPosition = signal<'bottom' | 'right'>('bottom');
  protected drawerStyleClass = signal<'h-[70vh]' | 'w-1/3'>('h-[70vh]');

  public ngOnInit() {
    this._breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((result) => {
        if (result.matches) {
          this.drawerStyleClass.set('h-[70vh]');
          this.drawerPosition.set('bottom');
          this.position.emit(DrawerPosition.Bottom);
        } else {
          this.drawerStyleClass.set('w-1/3');
          this.drawerPosition.set('right');
          this.position.emit(DrawerPosition.Right);
        }
      });
  }

  protected onDefectEditClicked(event: MouseEvent) {
    console.log(`Clicked on edit of ${this.defect()?.title} with event ${event.type}.`);
    this.editClicked.emit(event);
  }

  protected onDefectSaveClicked(event: MouseEvent) {
    console.log(`Clicked on save of ${this.defect()?.title} with event ${event.type}.`);
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Wollen Sie diesen Defekt wirklich speichern?',
      icon: 'pi pi-save',
      accept: () => {
        console.log(`Confirm on save of ${this.defect()?.title}.`);
        this.saveClicked.emit(event);
      },
    });
  }

  protected onDefectDeleteClicked(event: Event) {
    console.log(`Clicked on delete of ${this.defect()?.title} with event ${event.type}.`);
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Wollen Sie diesen Defekt wirklich löschen?',
      icon: 'pi pi-trash',
      accept: () => {
        console.log(`Confirm on delete of ${this.defect()?.title}.`);
        this.deleteClicked.emit(true);
      },
    });
  }

  protected onCloseClicked(event: MouseEvent) {
    console.log(`Clicked on close of ${this.defect()?.title} with event ${event.type}.`);
    this.closeClicked.emit(event);
  }
}
