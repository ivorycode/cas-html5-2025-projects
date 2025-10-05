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
import { TableModule } from 'primeng/table';
import { UIChart } from 'primeng/chart';
import { ChartData, ChartDataset, ChartOptions, Point } from 'chart.js';
import { DefectView } from '../../../core/models/Defect';
import {
  DefectStateColorMap,
  DefectStateMap,
  DefectStates,
} from '../../../core/models/DefectState';
import 'chartjs-adapter-moment';

@Component({
  selector: 'ii-defect-status-chart-line',
  templateUrl: './defect-status-chart-line.html',
  imports: [TableModule, UIChart],
})
export class DefectStatusChartLine {
  // Services
  private _changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);

  // Input/Outputs
  public states = input.required<DefectStates[]>();
  public defects = input.required<DefectView[]>();

  // Signals
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
      datasets: this.createChartDataSet(),
    } as ChartData;
  }

  private createChartOptions(): ChartOptions {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            usePointStyle: false,
          },
        },
      },
      scales: {
        x: {
          type: 'time',
          display: true,
          time: {
            unit: 'day',
          },
          title: {
            display: true,
            text: 'Datum',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Abstimmung',
          },
        },
      },
    } as ChartOptions;
  }

  private createLabels(): Date[] {
    return this.defects().map((defect) => new Date(defect.updatedAt));
  }

  private createChartDataSet(): ChartDataset[] {
    return this.states().map((state: DefectStates) => this.createChartDataEntry(state));
  }

  private createChartDataEntry(state: DefectStates): ChartDataset {
    const defectPerStatus = this.defects().filter((defect) => defect.state == state);
    const numberOfStatesPerDayRaw = this.computeNumberOfNewStatesPerDay(defectPerStatus);
    const numberOfStatesPerDaySortedAndFilled =
      this.sortAndFillMissingData(numberOfStatesPerDayRaw);
    const xValues = Object.keys(numberOfStatesPerDaySortedAndFilled).map(
      (dateStr) => new Date(dateStr),
    );
    const yValues = Object.values(numberOfStatesPerDaySortedAndFilled);
    // @ts-expect-error ChartJ with Date allowing x:Date, y:number
    const data: Point[] = xValues.map((x, i) => ({ x, y: yValues[i] }));
    return {
      label: DefectStateMap.get(state),
      data: data,
      borderColor: DefectStateColorMap.get(state),
    } as ChartDataset;
  }

  private computeNumberOfNewStatesPerDay(defects: DefectView[]): Record<string, number> {
    return defects.reduce(
      (acc, defect) => {
        const dayString = DefectStatusChartLine.formatDatePerDay(defect.updatedAt);
        if (!acc[dayString]) {
          acc[dayString] = 0;
        }
        acc[dayString] += 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private sortAndFillMissingData(data: Record<string, number>): Record<string, number> {
    const filledData: Record<string, number> = {};
    const dates = this.defects()
      .map((d) => new Date(d.updatedAt))
      .sort((a, b) => a.getTime() - b.getTime());

    for (const date of dates) {
      const key = DefectStatusChartLine.formatDatePerDay(date);
      filledData[key] = data[key] ?? 0;
    }
    return filledData;
  }

  private static formatDatePerDay(date: string | Date): string {
    return new Date(date).toISOString().slice(0, 10);
  }
}
