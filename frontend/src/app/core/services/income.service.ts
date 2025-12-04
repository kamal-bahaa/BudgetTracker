import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Income, IncomeResponse, SingleIncomeResponse } from '../models/income.model';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private readonly API_URL = 'http://localhost:5000/api/income';

  constructor(private http: HttpClient) {}

  getIncome(): Observable<IncomeResponse> {
    return this.http.get<IncomeResponse>(this.API_URL);
  }

  addIncome(income: Income): Observable<SingleIncomeResponse> {
    return this.http.post<SingleIncomeResponse>(this.API_URL, income);
  }

  updateIncome(id: string, income: Partial<Income>): Observable<SingleIncomeResponse> {
    return this.http.patch<SingleIncomeResponse>(`${this.API_URL}/${id}`, income);
  }

  deleteIncome(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}