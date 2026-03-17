import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../core/services/employee.service';
import { AuthService } from '../../../core/services/auth.service';
import { FoodItem } from '../../../core/models/models';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Canteen Menu 📋</h1>
        <p>Browse all available dishes from our vendors</p>
      </div>

      <!-- Search -->
      <div class="search-box">
        <mat-icon>search</mat-icon>
        <input [(ngModel)]="searchTerm" placeholder="Search dishes..." (input)="filter()">
      </div>

      <div class="food-grid" *ngIf="filtered.length">
        <div class="food-card" *ngFor="let item of filtered">
          <div class="food-name">{{ item.name }}</div>
          <div class="food-description">{{ item.description }}</div>
          <div class="food-price">₹{{ item.price }}</div>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <div class="n-value">{{ item.calories }}</div>
              <div class="n-label">Calories</div>
            </div>
            <div class="nutrition-item">
              <div class="n-value">{{ item.protein }}g</div>
              <div class="n-label">Protein</div>
            </div>
            <div class="nutrition-item">
              <div class="n-value">{{ item.carbohydrates }}g</div>
              <div class="n-label">Carbs</div>
            </div>
            <div class="nutrition-item">
              <div class="n-value">{{ item.fats }}g</div>
              <div class="n-label">Fats</div>
            </div>
          </div>
          <div class="vendor-tag" *ngIf="item.vendor">
            🏪 {{ item.vendor.fullName || item.vendor.username }}
          </div>
          <button mat-raised-button color="primary" style="margin-top: 16px; width: 100%" (click)="placeOrder(item)">
            Order Now
          </button>
        </div>
      </div>

      <div class="empty" *ngIf="!filtered.length && !loading">
        <span style="font-size:48px">🍽️</span>
        <p style="color:#64748b;margin-top:12px">{{ searchTerm ? 'No dishes match your search' : 'No food items available yet' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .search-box {
      display: flex; align-items: center; gap: 12px;
      background: #1e293b; border: 1px solid rgba(99,102,241,0.2);
      border-radius: 12px; padding: 12px 16px; margin-bottom: 24px;
      mat-icon { color: #64748b; }
      input { background: none; border: none; outline: none; color: #f1f5f9; font-size: 15px; width: 100%; flex: 1; }
    }
    .food-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .vendor-tag { font-size: 12px; color: #64748b; margin-top: 12px; }
    .empty { text-align: center; padding: 80px 0; }
  `]
})
export class MenuComponent implements OnInit {
  items: FoodItem[] = [];
  filtered: FoodItem[] = [];
  searchTerm = '';
  loading = true;

  constructor(
    private employeeService: EmployeeService, 
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.employeeService.getAllActiveFoodItems().subscribe({
      next: (items) => { this.items = items; this.filtered = items; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  filter() {
    const term = this.searchTerm.toLowerCase();
    this.filtered = this.items.filter(i =>
      i.name.toLowerCase().includes(term) ||
      i.description?.toLowerCase().includes(term)
    );
  }

  placeOrder(item: FoodItem) {
    const user = this.auth.currentUser;
    if (!user || user.role !== 'EMPLOYEE') return;
    
    this.employeeService.placeOrder(user.userId, item.id!).subscribe({
      next: (order) => {
        this.snackBar.open(`Successfully ordered ${item.name}! Your One Time Code is: ${order.oneTimeCode}`, 'Close', { duration: 10000 });
      },
      error: () => {
        this.snackBar.open('Error placing order.', 'OK', { duration: 3000, panelClass: 'snack-error' });
      }
    });
  }
}
