import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';

import { BaseChartDirective } from 'ng2-charts';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AnalyticsComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    BaseChartDirective, 
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class AnalyticsModule { }