import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="cart-dialog">
      <h2 mat-dialog-title>Your Cart 🛒</h2>
      <mat-dialog-content>
        <div *ngIf="items.length === 0" class="empty-cart">
          <p>Your cart is empty.</p>
        </div>
        
        <div *ngIf="items.length > 0" class="cart-items">
          <div class="cart-item" *ngFor="let item of items; let i = index">
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-price">₹{{ item.price }}</span>
            </div>
            <button mat-icon-button color="warn" (click)="removeItem(i)" title="Remove">
              <mat-icon>remove_circle_outline</mat-icon>
            </button>
          </div>
          <div class="cart-total">
            <strong>Total:</strong>
            <strong>₹{{ total }}</strong>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Close</button>
        <button mat-raised-button color="primary" [disabled]="items.length === 0" (click)="checkout()">Proceed to Checkout</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .cart-dialog { background: #1e293b; color: #f1f5f9; border-radius: 8px; }
    ::ng-deep .mat-mdc-dialog-container { background-color: #1e293b !important; color: #f1f5f9; }
    h2 { color: #f1f5f9; border-bottom: 1px solid rgba(99,102,241,0.2); padding-bottom: 10px; margin-bottom: 15px; }
    .empty-cart { text-align: center; color: #94a3b8; padding: 20px 0; }
    .cart-items { display: flex; flex-direction: column; gap: 12px; }
    .cart-item { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; }
    .item-info { display: flex; flex-direction: column; }
    .item-name { font-weight: 500; font-size: 15px; }
    .item-price { color: #F5911A; font-weight: 600; font-size: 14px; }
    .cart-total { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(99,102,241,0.5); font-size: 18px; color: #f1f5f9; }
  `]
})
export class CartDialogComponent {
  constructor(
    public cartService: CartService,
    public dialogRef: MatDialogRef<CartDialogComponent>
  ) {}

  get items() { return this.cartService.getItems(); }
  get total() { return this.cartService.getTotal(); }

  removeItem(index: number) {
    this.cartService.removeFromCart(index);
    if (this.items.length === 0) {
      this.dialogRef.close();
    }
  }

  checkout() {
    this.dialogRef.close(true);
  }
}
