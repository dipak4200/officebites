import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FoodItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<FoodItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  addToCart(item: FoodItem) {
    const currentItems = this.itemsSubject.value;
    this.itemsSubject.next([...currentItems, item]);
  }

  removeFromCart(index: number) {
    const currentItems = [...this.itemsSubject.value];
    currentItems.splice(index, 1);
    this.itemsSubject.next(currentItems);
  }

  clearCart() {
    this.itemsSubject.next([]);
  }

  getItems(): FoodItem[] {
    return this.itemsSubject.value;
  }

  getTotal(): number {
    return this.itemsSubject.value.reduce((total, item) => total + (item.price || 0), 0);
  }
}
