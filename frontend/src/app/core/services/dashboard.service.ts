import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = 'http://localhost:5000/api/dashboard';

  constructor(private http: HttpClient) {}

  getOverview(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.API_URL}/overview`);
  }
}