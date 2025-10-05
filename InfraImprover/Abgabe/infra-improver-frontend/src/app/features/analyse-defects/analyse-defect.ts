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
import { DefectTable } from './defect-table/defect-table';
import { SupabaseService } from '../../core/supabase-service';
import { DefectView } from '../../core/models/Defect';
import { Card } from 'primeng/card';
import { DefectCategories } from '../../core/models/DefectCategory';
import { DefectStates } from '../../core/models/DefectState';
import { DefectCategoryChartPie } from './defect-category-chart-pie/defect-category-chart-pie';
import { DefectStatusChartLine } from './defect-status-chart-line/defect-status-chart-line';
import { PostGISLocationWithRadius } from '../../core/models/Location';
import { DefectLocationFilter } from './defect-location-filter/defect-location-filter';

@Component({
  selector: 'ii-defect-analysis',
  templateUrl: './analyse-defect.html',
  imports: [DefectTable, Card, DefectCategoryChartPie, DefectStatusChartLine, DefectLocationFilter],
})
export default class AnalyseDefect implements OnInit {
  // Services
  private _supabase: SupabaseService = inject(SupabaseService);

  // Signal
  protected categories = signal<DefectCategories[]>([]);
  protected states = signal<DefectStates[]>([]);
  protected defects = signal<DefectView[]>([]);

  public async ngOnInit() {
    const categories = await this._supabase.getCategories();
    this.categories.set(categories);

    const states = await this._supabase.getStates();
    this.states.set(states);

    const defects = await this._supabase.getDefects();
    this.defects.set(defects);
  }

  protected async onFilterReset() {
    const defects = await this._supabase.getDefects();
    this.defects.set(defects);
  }

  protected async onFilterChange(gisLocationWithRadius: PostGISLocationWithRadius) {
    console.log(
      `Point changed: ${gisLocationWithRadius.coordinates[0]},
      ${gisLocationWithRadius.coordinates[1]},
      radius: ${gisLocationWithRadius.radius_in_meters}`,
    );
    const defects = await this._supabase.getDefectsInRadius(gisLocationWithRadius);
    this.defects.set(defects);
  }

  protected async onEditDefect(defect: DefectView) {
    console.log(`Change defect: ${defect.title}`);
    if (defect.id) {
      const updatedDefect = await this._supabase.updateDefect(defect.id, defect);
      if (updatedDefect) {
        const newDefects = this.defects().map((d) => (d?.id === defect?.id ? updatedDefect : d));
        this.defects.set(newDefects);
      }
    }
  }
}
