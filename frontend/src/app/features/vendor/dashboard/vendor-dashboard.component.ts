import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { VendorService } from '../../../core/services/vendor.service';
import { FoodItem } from '../../../core/models/models';


@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSnackBarModule, MatIconModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Vendor Dashboard</h1>
        <p>Manage your food items and track performance</p>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(99,102,241,0.15)">🍽️</div>
          <div class="stat-value">{{ totalItems }}</div>
          <div class="stat-label">Total Items</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(16,185,129,0.15)">✅</div>
          <div class="stat-value">{{ activeItems }}</div>
          <div class="stat-label">Active Items</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(245,158,11,0.15)">🔒</div>
          <div class="stat-value">{{ totalItems - activeItems }}</div>
          <div class="stat-label">Hidden Items</div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-title-row">
          <h3>Recent Food Items</h3>
          <a mat-stroked-button routerLink="/vendor/food-items" style="color:#6366f1">View All & Add</a>
        </div>
        <div class="food-grid" *ngIf="items.length">
          <div class="food-card" *ngFor="let item of items.slice(0,6)">
            <div class="food-name">{{ item.name }}</div>
            <div class="food-description">{{ item.description }}</div>
            <div class="food-price">₹{{ item.price }}</div>
            <div class="nutrition-grid">
              <div class="nutrition-item"><div class="n-value">{{ item.calories }}</div><div class="n-label">Cal</div></div>
              <div class="nutrition-item"><div class="n-value">{{ item.protein }}g</div><div class="n-label">Protein</div></div>
              <div class="nutrition-item"><div class="n-value">{{ item.carbohydrates }}g</div><div class="n-label">Carbs</div></div>
              <div class="nutrition-item"><div class="n-value">{{ item.fats }}g</div><div class="n-label">Fats</div></div>
            </div>
            <div style="margin-top:12px">
              <span class="badge" [class.badge-success]="item.isActive" [class.badge-danger]="!item.isActive">
                {{ item.isActive ? 'Active' : 'Hidden' }}
              </span>
            </div>
          </div>
        </div>
        <p *ngIf="!items.length" class="empty">No food items yet. Go to <strong>My Food Items</strong> to add some!</p>
      </div>
    </div>
  `,
  styles: [`
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
    .food-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-top: 16px; }
    .section-card { background: #1e293b; border: 1px solid rgba(99,102,241,0.2); border-radius: 16px; padding: 24px; }
    .section-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; h3 { color: #f1f5f9; font-size: 16px; font-weight: 600; } }
    .empty { color: #64748b; text-align: center; padding: 32px; }
  `]
})
export class VendorDashboardComponent implements OnInit {
  items: FoodItem[] = [];
  get totalItems() { return this.items.length; }
  get activeItems() { return this.items.filter(i => i.isActive).length; }

  constructor(private vendorService: VendorService) {}

  ngOnInit() {
    this.vendorService.getMyFoodItems().subscribe(items => this.items = items);
  }
}
