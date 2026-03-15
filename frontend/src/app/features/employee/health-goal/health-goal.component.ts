import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../core/services/employee.service';
import { GoalType } from '../../../core/models/models';

@Component({
  selector: 'app-health-goal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSnackBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Set Health Goal 🎯</h1>
        <p>Configure your daily nutrition targets to get personalized food recommendations</p>
      </div>

      <div class="goal-layout">
        <!-- Goal Presets -->
        <div class="presets-panel">
          <h3>Choose a Preset</h3>
          <div class="preset-card" (click)="applyPreset('WEIGHT_LOSS')">
            <span class="preset-icon">⚖️</span>
            <div>
              <div class="preset-name">Weight Loss</div>
              <div class="preset-desc">Lower calories, balanced macros</div>
            </div>
          </div>
          <div class="preset-card" (click)="applyPreset('MUSCLE_GAIN')">
            <span class="preset-icon">💪</span>
            <div>
              <div class="preset-name">Muscle Gain</div>
              <div class="preset-desc">Higher protein, more calories</div>
            </div>
          </div>
          <div class="preset-card" (click)="applyPreset('MAINTENANCE')">
            <span class="preset-icon">✅</span>
            <div>
              <div class="preset-name">Maintenance</div>
              <div class="preset-desc">Stay healthy and balanced</div>
            </div>
          </div>
        </div>

        <!-- Goal Form -->
        <div class="form-panel">
          <h3>Your Goal Details</h3>
          <form [formGroup]="goalForm" (ngSubmit)="save()">
            <mat-form-field appearance="outline">
              <mat-label>Goal Type</mat-label>
              <mat-select formControlName="goalType">
                <mat-option value="WEIGHT_LOSS">⚖️ Weight Loss</mat-option>
                <mat-option value="MUSCLE_GAIN">💪 Muscle Gain</mat-option>
                <mat-option value="MAINTENANCE">✅ Maintenance</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="input-row">
              <mat-form-field appearance="outline">
                <mat-label>Daily Calories Target (kcal)</mat-label>
                <input matInput type="number" formControlName="targetDailyCalories">
                <mat-error *ngIf="goalForm.get('targetDailyCalories')?.hasError('required')">Required</mat-error>
                <mat-error *ngIf="goalForm.get('targetDailyCalories')?.hasError('min') || goalForm.get('targetDailyCalories')?.hasError('max')">500 - 10,000 kcal</mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Daily Protein Target (g)</mat-label>
                <input matInput type="number" step="0.1" formControlName="targetDailyProtein">
                <mat-error *ngIf="goalForm.get('targetDailyProtein')?.hasError('required')">Required</mat-error>
                <mat-error *ngIf="goalForm.get('targetDailyProtein')?.hasError('min') || goalForm.get('targetDailyProtein')?.hasError('max')">10 - 500 g</mat-error>
              </mat-form-field>
            </div>

            <div class="input-row">
              <mat-form-field appearance="outline">
                <mat-label>Current Weight (kg) — optional</mat-label>
                <input matInput type="number" step="0.1" formControlName="currentWeight">
                <mat-error *ngIf="goalForm.get('currentWeight')?.hasError('min') || goalForm.get('currentWeight')?.hasError('max')">20 - 300 kg</mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Target Weight (kg) — optional</mat-label>
                <input matInput type="number" step="0.1" formControlName="targetWeight">
                <mat-error *ngIf="goalForm.get('targetWeight')?.hasError('min') || goalForm.get('targetWeight')?.hasError('max')">20 - 300 kg</mat-error>
              </mat-form-field>
            </div>

            <div class="success-msg" *ngIf="saved">
              ✅ Health goal saved! Food recommendations are now personalized for you.
            </div>

            <button mat-raised-button type="submit" class="btn-primary-gradient save-btn" [disabled]="goalForm.invalid">
              Save Goal
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .goal-layout { display: grid; grid-template-columns: 280px 1fr; gap: 24px; }
    .presets-panel, .form-panel { background: #1C1612; border: 1px solid rgba(245,145,26,0.2); border-radius: 16px; padding: 24px; }
    h3 { font-size: 16px; font-weight: 600; color: #f1f5f9; margin-bottom: 16px; }
    .preset-card {
      display: flex; align-items: center; gap: 14px; padding: 16px; margin-bottom: 12px;
      background: rgba(245,145,26,0.04); border: 1px solid rgba(245,145,26,0.1);
      border-radius: 12px; cursor: pointer; transition: all 0.2s;
      &:hover { background: rgba(245,145,26,0.1); border-color: rgba(245,145,26,0.4); }
    }
    .preset-icon { font-size: 28px; }
    .preset-name { font-size: 14px; font-weight: 600; color: #f1f5f9; }
    .preset-desc { font-size: 12px; color: #64748b; margin-top: 2px; }
    .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .save-btn { width: 100%; height: 48px; margin-top: 8px; }
    .success-msg { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #86efac; padding: 12px 16px; border-radius: 10px; font-size: 14px; margin-bottom: 12px; }
    @media(max-width: 768px) { .goal-layout { grid-template-columns: 1fr; } .input-row { grid-template-columns: 1fr; } }
  `]
})
export class HealthGoalComponent implements OnInit {
  goalForm: FormGroup;
  saved = false;

  presets: Record<GoalType, { calories: number; protein: number }> = {
    WEIGHT_LOSS: { calories: 1500, protein: 100 },
    MUSCLE_GAIN: { calories: 2800, protein: 160 },
    MAINTENANCE: { calories: 2000, protein: 120 }
  };

  constructor(private fb: FormBuilder, private employeeService: EmployeeService, private snackBar: MatSnackBar) {
    this.goalForm = this.fb.group({
      goalType: ['', Validators.required],
      targetDailyCalories: ['', [Validators.required, Validators.min(500), Validators.max(10000)]],
      targetDailyProtein: ['', [Validators.required, Validators.min(10), Validators.max(500)]],
      currentWeight: [null, [Validators.min(20), Validators.max(300)]],
      targetWeight: [null, [Validators.min(20), Validators.max(300)]]
    });
  }

  ngOnInit() {
    this.employeeService.getMyHealthGoal().subscribe({
      next: (goal) => this.goalForm.patchValue(goal),
      error: () => {}
    });
  }

  applyPreset(type: GoalType) {
    const p = this.presets[type];
    this.goalForm.patchValue({ goalType: type, targetDailyCalories: p.calories, targetDailyProtein: p.protein });
  }

  save() {
    if (this.goalForm.invalid) return;
    this.employeeService.setHealthGoal(this.goalForm.value).subscribe({
      next: () => {
        this.saved = true;
        this.snackBar.open('Health goal saved!', 'OK', { duration: 3000, panelClass: 'snack-success' });
      },
      error: () => this.snackBar.open('Error saving goal', 'OK', { duration: 3000, panelClass: 'snack-error' })
    });
  }
}
