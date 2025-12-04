import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalyticsResponse, ChartDataPoint, YearlyTrendData } from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly API_URL = 'http://localhost:5000/api/analytics';

  constructor(private http: HttpClient) {}

  getYearlyTrend(): Observable<AnalyticsResponse<YearlyTrendData>> {
    return this.http.get<AnalyticsResponse<YearlyTrendData>>(`${this.API_URL}/yearly-trend`);
  }

  getExpenseByCategory(): Observable<AnalyticsResponse<ChartDataPoint[]>> {
    return this.http.get<AnalyticsResponse<ChartDataPoint[]>>(`${this.API_URL}/expense-category`);
  }

  getMonthlySpending(): Observable<AnalyticsResponse<ChartDataPoint[]>> {
    return this.http.get<AnalyticsResponse<ChartDataPoint[]>>(`${this.API_URL}/monthly-spending`);
  }

  getIncomeBySource(): Observable<AnalyticsResponse<ChartDataPoint[]>> {
    return this.http.get<AnalyticsResponse<ChartDataPoint[]>>(`${this.API_URL}/income-source`);
  }
}