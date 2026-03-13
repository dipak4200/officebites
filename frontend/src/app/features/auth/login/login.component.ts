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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="auth-card">
      <h2>Welcome Back 👋</h2>
      <p class="subtitle">Sign in to your account</p>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
        <mat-form-field appearance="outline">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" placeholder="Enter username">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" placeholder="Enter password">
        </mat-form-field>

        <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>

        <button mat-raised-button type="submit" class="btn-primary-gradient submit-btn"
                [disabled]="loginForm.invalid || loading">
          <mat-spinner diameter="18" *ngIf="loading"></mat-spinner>
          <span *ngIf="!loading">Sign In</span>
        </button>
      </form>

      <p class="auth-link">New employee? <a routerLink="/auth/register">Create account</a></p>

      <div class="demo-accounts">
        <p class="demo-title">Demo Accounts</p>
        <div class="demo-grid">
          <div class="demo-item" (click)="fill('admin','admin123')">
            <span class="demo-role admin">ADMIN</span>
            <code>admin / admin123</code>
          </div>
          <div class="demo-item" (click)="fill('vendor1','password123')">
            <span class="demo-role vendor">VENDOR</span>
            <code>vendor1 / password123</code>
          </div>
          <div class="demo-item" (click)="fill('john','password123')">
            <span class="demo-role employee">EMPLOYEE</span>
            <code>john / password123</code>
          </div>
        </div>
      </div>
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
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .submit-btn {
      margin-top: 8px;
      height: 48px;
      font-size: 15px;
      border-radius: 12px !important;
    }
    .error-msg {
      background: rgba(239,68,68,0.15);
      border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
    }
    .auth-link {
      text-align: center;
      margin-top: 20px;
      color: #94a3b8;
      font-size: 14px;
      a { color: #6366f1; text-decoration: none; font-weight: 600; }
    }
    .demo-accounts {
      margin-top: 24px;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 20px;
      .demo-title { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    }
    .demo-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .demo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      &:hover { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.3); }
      code { font-size: 13px; color: #94a3b8; }
    }
    .demo-role {
      padding: 2px 8px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      min-width: 70px;
      text-align: center;
      &.admin { background: rgba(239,68,68,0.15); color: #ef4444; }
      &.vendor { background: rgba(245,158,11,0.15); color: #f59e0b; }
      &.employee { background: rgba(16,185,129,0.15); color: #10b981; }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  fill(username: string, password: string) {
    this.loginForm.patchValue({ username, password });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.auth.login(this.loginForm.value).subscribe({
      next: () => { this.loading = false; this.auth.redirectToRole(); },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Login failed. Please check your credentials.';
      }
    });
  }
}
