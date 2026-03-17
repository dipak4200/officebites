import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VendorService } from '../../../core/services/vendor.service';
import { Order } from '../../../core/models/models';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Pending Orders ⏳</h1>
        <p>Complete orders by entering the customer's One Time Code (OTC)</p>
      </div>

      <div *ngIf="loading" class="empty">
        <p>Loading pending orders...</p>
      </div>

      <div class="orders-list" *ngIf="!loading && orders.length > 0">
        <div class="order-card" *ngFor="let order of orders">
          <div class="order-header">
            <h3>{{ order.foodItem.name }}</h3>
            <span class="status-badge pending">PENDING</span>
          </div>
          
          <div class="order-details">
            <p><strong>Employee:</strong> <span class="highlight">{{ order.employee?.fullName || order.employee?.username }}</span></p>
            <p><strong>Order Date:</strong> {{ order.orderDate | date:'short' }}</p>
          </div>
          
          <div class="otc-section">
            <mat-form-field appearance="outline" class="otc-input">
              <mat-label>Enter OTC</mat-label>
              <input matInput [(ngModel)]="otcInputs[order.id || 0]" placeholder="6-digit code">
            </mat-form-field>
            <button mat-flat-button color="primary" (click)="deliverOrder(order)">Confirm Delivery</button>
          </div>
        </div>
      </div>

      <div class="empty" *ngIf="!loading && orders.length === 0">
        <span style="font-size:48px">🎉</span>
        <p style="color:#64748b;margin-top:12px">All caught up! No pending orders right now.</p>
      </div>
    </div>
  `,
  styles: [`
    .orders-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
    .order-card { background: #1e293b; border: 1px solid rgba(245,145,26,0.3); border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; border-bottom: 1px solid #334155; padding-bottom: 12px; }
    .order-header h3 { margin: 0; color: #f1f5f9; font-size: 20px; }
    .status-badge { padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; letter-spacing: 0.5px; }
    .status-badge.pending { background: rgba(245, 145, 26, 0.15); color: #F5911A; }
    .order-details p { color: #94a3b8; font-size: 15px; margin: 6px 0; }
    .highlight { color: #e2e8f0; font-weight: 500; font-size: 16px; }
    .otc-section { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
    ::ng-deep .otc-input { width: 100%; }
    ::ng-deep .otc-input .mat-mdc-form-field-wrapper { margin-bottom: -1.25em; }
    .empty { text-align: center; padding: 80px 0; }
  `]
})
export class VendorOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  otcInputs: { [orderId: number]: string } = {};

  constructor(
    private vendorService: VendorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.vendorService.getPendingOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
        orders.forEach(o => {
          if (o.id) this.otcInputs[o.id] = '';
        });
      },
      error: () => this.loading = false
    });
  }

  deliverOrder(order: Order) {
    if (!order.id) return;
    const otc = this.otcInputs[order.id];
    
    if (!otc || otc.length < 6) {
      this.snackBar.open('Please enter a valid 6-digit OTC.', 'Close', { duration: 3000, panelClass: 'snack-error' });
      return;
    }

    this.vendorService.deliverOrder(otc).subscribe({
      next: () => {
        this.snackBar.open(`Successfully delivered ${order.foodItem.name}!`, 'Close', { duration: 3000 });
        this.loadData(); // refresh the list
      },
      error: (err) => {
        let msg = 'Invalid OTC or delivery failed.';
        if (err.status === 404) msg = 'Invalid or expired OTC code.';
        else if (err.status === 403) msg = 'Not authorized to deliver this order.';
        
        this.snackBar.open(msg, 'Close', { duration: 4000, panelClass: 'snack-error' });
      }
    });
  }
}
