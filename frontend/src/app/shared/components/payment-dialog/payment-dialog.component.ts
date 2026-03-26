import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="payment-dialog">
      <h2 mat-dialog-title>Secure Checkout 💳</h2>
      <mat-dialog-content>
        <div class="payment-amount">
          Total to Pay: <strong>₹{{ total }}</strong>
        </div>
        <p class="subtitle">Please enter your payment details below</p>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Card Number</mat-label>
          <input matInput placeholder="XXXX-XXXX-XXXX-XXXX" value="4111-1111-1111-1111">
        </mat-form-field>
        
        <div class="payment-row">
          <mat-form-field appearance="outline">
            <mat-label>Expiry (MM/YY)</mat-label>
            <input matInput placeholder="12/26" value="12/26">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>CVV</mat-label>
            <input matInput type="password" placeholder="123" value="123">
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="pay()">OK</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .payment-dialog { background: #1e293b; color: #f1f5f9; border-radius: 8px; }
    h2 { color: #f1f5f9; border-bottom: 1px solid rgba(99,102,241,0.2); padding-bottom: 10px; margin-bottom: 15px; }
    .subtitle { color: #94a3b8; font-size: 13px; margin-bottom: 15px; }
    .payment-amount { font-size: 18px; color: #F5911A; margin-bottom: 10px; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .payment-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  `]
})
export class PaymentDialogComponent {
  constructor(
    public cartService: CartService,
    public dialogRef: MatDialogRef<PaymentDialogComponent>
  ) {}

  get total() { return this.cartService.getTotal(); }

  pay() {
    this.dialogRef.close(true);
  }
}
