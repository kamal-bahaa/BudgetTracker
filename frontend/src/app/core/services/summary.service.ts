import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SummaryResponse } from '../models/summary.model';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private readonly API_URL = 'http://localhost:5000/api/summary';

  constructor(private http: HttpClient) {}

  getMonthlySummary(month: string): Observable<SummaryResponse> {
    // Backend expects ?month=YYYY-MM
    const params = new HttpParams().set('month', month);
    return this.http.get<SummaryResponse>(`${this.API_URL}/overview`, { params });
  }
}