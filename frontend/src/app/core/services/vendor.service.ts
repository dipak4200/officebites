import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FoodItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class VendorService {
  private base = 'http://localhost:8080/api/vendor';

  constructor(private http: HttpClient) {}

  getMyFoodItems(): Observable<FoodItem[]> {
    return this.http.get<FoodItem[]>(`${this.base}/food-items`);
  }

  addFoodItem(item: FoodItem): Observable<FoodItem> {
    return this.http.post<FoodItem>(`${this.base}/food-items`, item);
  }

  updateFoodItem(id: number, item: FoodItem): Observable<FoodItem> {
    return this.http.put<FoodItem>(`${this.base}/food-items/${id}`, item);
  }

  deleteFoodItem(id: number): Observable<any> {
    return this.http.delete(`${this.base}/food-items/${id}`);
  }

  getPendingOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/orders/pending`);
  }

  deliverOrder(otc: string): Observable<any> {
    return this.http.post(`${this.base}/orders/deliver/${otc}`, {});
  }
}
