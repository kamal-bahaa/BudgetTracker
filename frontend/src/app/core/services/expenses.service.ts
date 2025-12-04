import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense, ExpenseResponse, SingleExpenseResponse } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly API_URL = 'http://localhost:5000/api/expenses';

  constructor(private http: HttpClient) {}

  getExpenses(): Observable<ExpenseResponse> {
    return this.http.get<ExpenseResponse>(this.API_URL);
  }

  addExpense(expense: Expense): Observable<SingleExpenseResponse> {
    return this.http.post<SingleExpenseResponse>(this.API_URL, expense);
  }

  updateExpense(id: string, expense: Partial<Expense>): Observable<SingleExpenseResponse> {
    return this.http.patch<SingleExpenseResponse>(`${this.API_URL}/${id}`, expense);
  }

  deleteExpense(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}