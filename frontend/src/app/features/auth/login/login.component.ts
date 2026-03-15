import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatProgressSpinnerModule],
  template: `
    <div class="auth-card">
      <h2>Welcome Back 👋</h2>
      <p class="subtitle">Sign in to your account</p>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">

        <div class="field-group">
          <label class="field-label" for="username">Username</label>
          <input
            id="username"
            class="field-input"
            type="text"
            formControlName="username"
            placeholder="Enter your username"
            autocomplete="username">
          <div class="field-error" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
            <span *ngIf="loginForm.get('username')?.errors?.['required']">Username is required</span>
            <span *ngIf="loginForm.get('username')?.errors?.['minlength']">Minimum 3 characters</span>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="password">Password</label>
          <input
            id="password"
            class="field-input"
            type="password"
            formControlName="password"
            placeholder="Enter your password"
            autocomplete="current-password">
          <div class="field-error" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
            <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Minimum 6 characters</span>
          </div>
        </div>

        <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>

        <button type="submit" class="submit-btn" [disabled]="loginForm.invalid || loading">
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
      background: rgba(28,22,18,0.95);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(245,145,26,0.25);
      border-radius: 24px;
      padding: 40px;
      width: 100%;
      max-width: 440px;
    }
    h2 { font-size: 24px; font-weight: 700; color: #F5F0E8; margin-bottom: 4px; }
    .subtitle { color: #A89880; font-size: 14px; margin-bottom: 28px; }

    .auth-form { display: flex; flex-direction: column; gap: 18px; }

    /* ── Custom Input Fields ── */
    .field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .field-label {
      font-size: 13px;
      font-weight: 600;
      color: #A89880;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .field-input {
      width: 100%;
      height: 48px;
      padding: 0 16px;
      background: rgba(245,145,26,0.06);
      border: 1.5px solid rgba(245,145,26,0.25);
      border-radius: 10px;
      color: #F5F0E8;
      font-size: 15px;
      font-family: 'Inter', sans-serif;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;

      &::placeholder { color: #5a4535; }

      &:focus {
        border-color: #F5911A;
        box-shadow: 0 0 0 3px rgba(245,145,26,0.15);
      }
    }

    .field-error {
      color: #ef4444;
      font-size: 11px;
      margin-top: 2px;
      padding-left: 4px;
    }

    .error-msg {
      background: rgba(239,68,68,0.12);
      border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
    }

    .submit-btn {
      width: 100%;
      height: 48px;
      background: linear-gradient(135deg, #F5911A, #FF6B00);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
      margin-top: 4px;

      &:hover:not(:disabled) {
        box-shadow: 0 8px 20px rgba(245,145,26,0.4);
        transform: translateY(-1px);
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .auth-link {
      text-align: center;
      margin-top: 20px;
      color: #A89880;
      font-size: 14px;
      a { color: #F5911A; text-decoration: none; font-weight: 600; }
    }

    .demo-accounts {
      margin-top: 24px;
      border-top: 1px solid rgba(245,145,26,0.15);
      padding-top: 20px;
      .demo-title {
        font-size: 11px;
        color: #6B5740;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 12px;
      }
    }
    .demo-grid { display: flex; flex-direction: column; gap: 8px; }
    .demo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: rgba(245,145,26,0.04);
      border: 1px solid rgba(245,145,26,0.1);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      &:hover { background: rgba(245,145,26,0.1); border-color: rgba(245,145,26,0.35); }
      code { font-size: 13px; color: #A89880; }
    }
    .demo-role {
      padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700;
      text-transform: uppercase; min-width: 70px; text-align: center;
      &.admin    { background: rgba(239,68,68,0.15);    color: #ef4444; }
      &.vendor   { background: rgba(245,145,26,0.15);   color: #F5911A; }
      &.employee { background: rgba(34,197,94,0.15);    color: #22c55e; }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
