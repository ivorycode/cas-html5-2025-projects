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

import { ChangeDetectorRef, Component, effect, inject, input, signal } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { DefectView } from '../../../core/models/Defect';
import { DefectCategories, DefectCategoryMap } from '../../../core/models/DefectCategory';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'ii-defect-category-chart-pie',
  templateUrl: './defect-category-chart-pie.html',
  imports: [UIChart],
})
export class DefectCategoryChartPie {
  // Services
  private _changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);

  // Input/Outputs
  public categories = input.required<DefectCategories[]>();
  public defects = input.required<DefectView[]>();

  // Internal Signals
  protected data = signal<ChartData | undefined>(undefined);
  protected options = signal<ChartOptions | undefined>(undefined);

  public constructor() {
    // Trigger drawing when defects changed
    effect(() => {
      // Initialize Chart Data
      const data = this.createChartData();
      this.data.set(data);

      // Initialize Chart Options
      const options = this.createChartOptions();
      this.options.set(options);

      // Add Chart Change Detector
      this._changeDetector.markForCheck();
    });
  }

  private createChartData(): ChartData {
    return {
      labels: this.createLabels(),
      datasets: [
        {
          data: this.createData(),
        },
      ],
    } as ChartData;
  }

  private createChartOptions(): ChartOptions {
    return {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    } as ChartOptions;
  }

  private createLabels(): (string | undefined)[] {
    return this.categories().map((category) => DefectCategoryMap.get(category));
  }

  private createData(): number[] {
    return this.categories().map((category) => this.computeNumberOfDefectPerCategory(category));
  }

  private computeNumberOfDefectPerCategory(category: DefectCategories): number {
    return this.defects()
      .filter((defect) => defect.category == category)
      .map(() => 1)
      .reduce((sum, a) => sum + a, 0);
  }
}
