import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal, GoalResponse, SingleGoalResponse } from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private readonly API_URL = 'http://localhost:5000/api/goals';

  constructor(private http: HttpClient) {}

  getGoals(): Observable<GoalResponse> {
    return this.http.get<GoalResponse>(this.API_URL);
  }

  addGoal(goal: Goal): Observable<SingleGoalResponse> {
    return this.http.post<SingleGoalResponse>(this.API_URL, goal);
  }

  updateGoal(id: string, goal: Partial<Goal>): Observable<SingleGoalResponse> {
    return this.http.patch<SingleGoalResponse>(`${this.API_URL}/${id}`, goal);
  }

  deleteGoal(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}