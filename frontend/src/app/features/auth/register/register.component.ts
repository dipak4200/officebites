import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="auth-card">
      <h2>Create Account ✨</h2>
      <p class="subtitle">Register as a new employee</p>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
        <mat-form-field appearance="outline">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="fullName" placeholder="Your full name">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="you@company.com">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" placeholder="Choose a username">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" placeholder="Min 8 characters">
        </mat-form-field>

        <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>
        <div class="success-msg" *ngIf="successMsg">{{ successMsg }}</div>

        <button mat-raised-button type="submit" class="btn-primary-gradient submit-btn"
                [disabled]="registerForm.invalid || loading">
          <mat-spinner diameter="18" *ngIf="loading"></mat-spinner>
          <span *ngIf="!loading">Create Account</span>
        </button>
      </form>
      <p class="auth-link">Already have an account? <a routerLink="/auth/login">Sign in</a></p>
    </div>
  `,
  styles: [`
    .auth-card {
      background: rgba(30,41,59,0.8);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 24px;
      padding: 40px;
      width: 100%;
      max-width: 440px;
      h2 { font-size: 24px; font-weight: 700; color: #f1f5f9; margin-bottom: 4px; }
      .subtitle { color: #94a3b8; font-size: 14px; margin-bottom: 28px; }
    }
    .auth-form { display: flex; flex-direction: column; gap: 4px; }
    .submit-btn { margin-top: 8px; height: 48px; font-size: 15px; border-radius: 12px !important; }
    .error-msg {
      background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5; padding: 10px 14px; border-radius: 8px; font-size: 13px;
    }
    .success-msg {
      background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3);
      color: #6ee7b7; padding: 10px 14px; border-radius: 8px; font-size: 13px;
    }
    .auth-link {
      text-align: center; margin-top: 20px; color: #94a3b8; font-size: 14px;
      a { color: #6366f1; text-decoration: none; font-weight: 600; }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Registration failed. Try again.';
      }
    });
  }
}
