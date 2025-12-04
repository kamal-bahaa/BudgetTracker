import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SummaryService } from '../../core/services/summary.service';
import { SummaryData } from '../../core/models/summary.model';

import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-summary',
  standalone: false,
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SummaryComponent implements OnInit {
  date = new FormControl(moment());
  isLoading = false;
  summary: SummaryData | null = null;

  constructor(private summaryService: SummaryService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value!;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close(); 
    this.loadSummary(); 
  }

  loadSummary(): void {
    this.isLoading = true;
    const selectedMonth = this.date.value!.format('YYYY-MM');

    this.summaryService.getMonthlySummary(selectedMonth).subscribe({
      next: (res) => {
        this.summary = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Summary Error:', err);
        this.isLoading = false;
      }
    });
  }

  getProgressBarColor(percent: number | null): string {
    if (!percent) return 'primary';
    return percent > 100 ? 'warn' : 'primary';
  }
}