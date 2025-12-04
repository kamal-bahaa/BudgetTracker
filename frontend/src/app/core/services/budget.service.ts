import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget, BudgetResponse, SingleBudgetResponse } from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly API_URL = 'http://localhost:5000/api/budget';

  constructor(private http: HttpClient) {}

  getBudgets(): Observable<BudgetResponse> {
    return this.http.get<BudgetResponse>(this.API_URL);
  }

  addBudget(budget: Budget): Observable<SingleBudgetResponse> {
    return this.http.post<SingleBudgetResponse>(this.API_URL, budget);
  }

  updateBudget(id: string, budget: Partial<Budget>): Observable<SingleBudgetResponse> {
    return this.http.patch<SingleBudgetResponse>(`${this.API_URL}/${id}`, budget);
  }

  deleteBudget(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}