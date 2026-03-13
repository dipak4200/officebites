import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FoodItem, HealthGoal } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private base = 'http://localhost:8080/api/employee';
  private publicBase = 'http://localhost:8080/api/public';

  constructor(private http: HttpClient) {}

  getMyHealthGoal(): Observable<HealthGoal> {
    return this.http.get<HealthGoal>(`${this.base}/health-goal`);
  }

  setHealthGoal(goal: HealthGoal): Observable<HealthGoal> {
    return this.http.post<HealthGoal>(`${this.base}/health-goal`, goal);
  }

  getRecommendations(): Observable<FoodItem[]> {
    return this.http.get<FoodItem[]>(`${this.base}/recommendations`);
  }

  getAllActiveFoodItems(): Observable<FoodItem[]> {
    return this.http.get<FoodItem[]>(`${this.publicBase}/food-items`);
  }
}
