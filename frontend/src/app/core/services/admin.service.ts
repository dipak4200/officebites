import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminStats, FoodItem, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.base}/stats`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/users`);
  }

  createVendor(data: { username: string; password: string; fullName: string; email: string }): Observable<User> {
    return this.http.post<User>(`${this.base}/vendors`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.base}/users/${id}`);
  }

  getAllFoodItems(): Observable<FoodItem[]> {
    return this.http.get<FoodItem[]>(`${this.base}/food-items`);
  }

  toggleFoodItemStatus(id: number, isActive: boolean): Observable<FoodItem> {
    return this.http.put<FoodItem>(`${this.base}/food-items/${id}/toggle?isActive=${isActive}`, {});
  }
}
