import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminService } from '../../../core/services/admin.service';
import { FoodItem } from '../../../core/models/models';

@Component({
  selector: 'app-admin-food-items',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSnackBarModule, MatIconModule, MatSlideToggleModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Food Items</h1>
        <p>Monitor all food items and toggle availability</p>
      </div>

      <div class="food-grid" *ngIf="items.length">
        <div class="food-card" *ngFor="let item of items">
          <div class="card-header">
            <div>
              <div class="food-name">{{ item.name }}</div>
              <div class="vendor-name">by {{ item.vendor?.fullName || 'Unknown' }}</div>
            </div>
            <mat-slide-toggle
              [checked]="item.isActive"
              (change)="toggle(item, $event.checked)"
              color="primary">
            </mat-slide-toggle>
          </div>
          <div class="food-description">{{ item.description }}</div>
          <div class="food-price">₹{{ item.price }}</div>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <div class="n-value">{{ item.calories }}</div>
              <div class="n-label">Cal</div>
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
          <div style="margin-top:12px">
            <span class="badge" [class.badge-success]="item.isActive" [class.badge-danger]="!item.isActive">
              {{ item.isActive ? 'Active' : 'Hidden' }}
            </span>
          </div>
        </div>
      </div>
      <p *ngIf="!items.length" class="empty">No food items yet.</p>
    </div>
  `,
  styles: [`
    .food-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
    .vendor-name { font-size: 12px; color: #64748b; margin-top: 2px; }
    .empty { color: #64748b; text-align: center; padding: 64px; font-size: 16px; }
  `]
})
export class AdminFoodItemsComponent implements OnInit {
  items: FoodItem[] = [];

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit() { this.adminService.getAllFoodItems().subscribe(i => this.items = i); }

  toggle(item: FoodItem, isActive: boolean) {
    this.adminService.toggleFoodItemStatus(item.id!, isActive).subscribe({
      next: (updated) => {
        item.isActive = updated.isActive;
        this.snackBar.open(`Item ${isActive ? 'activated' : 'hidden'}`, 'OK', { duration: 2000 });
      },
      error: () => this.snackBar.open('Error updating status', 'OK', { duration: 2000, panelClass: 'snack-error' })
    });
  }
}
