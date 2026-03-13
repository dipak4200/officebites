import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { FoodItem } from '../../../core/models/models';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Recommended For You ✨</h1>
        <p>Food curated based on your health goal</p>
      </div>

      <div class="info-banner" *ngIf="!loading && !items.length">
        <span class="banner-icon">💡</span>
        <div>
          <strong>No recommendations yet!</strong>
          <p>Set your health goal first to get personalized food picks.</p>
          <a mat-raised-button routerLink="/employee/health-goal" class="btn-primary-gradient" style="margin-top:12px">Set Health Goal</a>
        </div>
      </div>

      <div class="food-grid" *ngIf="items.length">
        <div class="food-card rec-card" *ngFor="let item of items">
          <div class="rec-badge">✨ Recommended</div>
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
        </div>
      </div>
    </div>
  `,
  styles: [`
    .info-banner {
      display: flex; align-items: flex-start; gap: 20px;
      background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3);
      border-radius: 16px; padding: 28px;
      .banner-icon { font-size: 36px; flex-shrink: 0; }
      strong { font-size: 16px; font-weight: 600; color: #f1f5f9; }
      p { color: #94a3b8; font-size: 14px; margin-top: 4px; }
    }
    .food-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .rec-card { position: relative; border-color: rgba(99,102,241,0.4) !important; }
    .rec-badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 4px 10px; background: linear-gradient(135deg,rgba(99,102,241,0.2),rgba(6,182,212,0.2));
      border: 1px solid rgba(99,102,241,0.4); border-radius: 20px;
      font-size: 11px; font-weight: 600; color: #a5b4fc; margin-bottom: 10px;
    }
    .vendor-tag { font-size: 12px; color: #64748b; margin-top: 12px; }
  `]
})
export class RecommendationsComponent implements OnInit {
  items: FoodItem[] = [];
  loading = true;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employeeService.getRecommendations().subscribe({
      next: (items) => { this.items = items; this.loading = false; },
      error: () => { this.items = []; this.loading = false; }
    });
  }
}
