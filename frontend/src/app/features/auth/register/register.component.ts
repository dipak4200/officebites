import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatProgressSpinnerModule],
  template: `
    <div class="auth-card">
      <h2>Create Account ✨</h2>
      <p class="subtitle">Register as a new employee</p>

      <!-- Toast popup for validation errors -->
      <div class="toast-popup" *ngIf="toastErrors.length > 0">
        <div class="toast-header">
          <span class="toast-icon">⚠️</span>
          <strong>Please fix the following:</strong>
          <button class="toast-close" (click)="toastErrors = []">✕</button>
        </div>
        <ul class="toast-list">
          <li *ngFor="let err of toastErrors">{{ err }}</li>
        </ul>
      </div>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">

        <div class="field-group">
          <label class="field-label" for="fullName">Full Name</label>
          <input id="fullName" class="field-input" type="text"
                 formControlName="fullName"
                 placeholder="e.g. Rahul Sharma"
                 [class.invalid]="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched">
          <div class="field-error" *ngIf="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched">
            <span *ngIf="registerForm.get('fullName')?.errors?.['required']">⚠ Full name is required</span>
            <span *ngIf="registerForm.get('fullName')?.errors?.['minlength']">⚠ At least 2 characters required</span>
            <span *ngIf="registerForm.get('fullName')?.errors?.['maxlength']">⚠ Maximum 50 characters allowed</span>
            <span *ngIf="registerForm.get('fullName')?.errors?.['pattern']">⚠ Only letters and spaces allowed (e.g. Rahul Sharma)</span>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="email">Email</label>
          <input id="email" class="field-input" type="email"
                 formControlName="email"
                 placeholder="e.g. rahul.sharma@company.com"
                 [class.invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
          <div class="field-error" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
            <span *ngIf="registerForm.get('email')?.errors?.['required']">⚠ Email is required</span>
            <span *ngIf="registerForm.get('email')?.errors?.['pattern']">⚠ Enter a valid email (e.g. name&#64;domain.com)</span>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="reg-username">Username</label>
          <input id="reg-username" class="field-input" type="text"
                 formControlName="username"
                 placeholder="e.g. rahul_sharma21 (3–20 chars)"
                 [class.invalid]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
          <div class="field-error" *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
            <span *ngIf="registerForm.get('username')?.errors?.['required']">⚠ Username is required</span>
            <span *ngIf="registerForm.get('username')?.errors?.['pattern']">⚠ Only letters, numbers & underscores, 3–20 chars (e.g. rahul_21)</span>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="reg-password">Password</label>
          <input id="reg-password" class="field-input" type="password"
                 formControlName="password"
                 placeholder="e.g. Rahul@123 (min 8 chars)"
                 [class.invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
          <div class="field-error" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
            <span *ngIf="registerForm.get('password')?.errors?.['required']">⚠ Password is required</span>
            <span *ngIf="registerForm.get('password')?.errors?.['pattern']">⚠ Must be 8–50 chars with uppercase, lowercase, digit &amp; special char (&#64;#$%^&amp;+=!)</span>
          </div>
          <div class="password-hint">
            Tip: Use a mix like <code>Name&#64;Year123</code>
          </div>
        </div>

        <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>
        <div class="success-msg" *ngIf="successMsg">{{ successMsg }}</div>

        <button type="submit" class="submit-btn" [disabled]="loading">
          <mat-spinner diameter="18" *ngIf="loading"></mat-spinner>
          <span *ngIf="!loading">Create Account</span>
        </button>
      </form>

      <p class="auth-link">Already have an account? <a routerLink="/auth/login">Sign in</a></p>
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
      position: relative;
    }
    h2 { font-size: 24px; font-weight: 700; color: #F5F0E8; margin-bottom: 4px; }
    .subtitle { color: #A89880; font-size: 14px; margin-bottom: 28px; }

    .auth-form { display: flex; flex-direction: column; gap: 18px; }

    /* ── Toast Popup ── */
    .toast-popup {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      background: rgba(20, 12, 8, 0.97);
      border: 1.5px solid rgba(239,68,68,0.55);
      border-radius: 14px;
      padding: 16px 18px;
      min-width: 280px;
      max-width: 360px;
      box-shadow: 0 8px 32px rgba(239,68,68,0.25);
      animation: slideIn 0.3s ease;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .toast-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fca5a5;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .toast-icon { font-size: 16px; }
    .toast-close {
      margin-left: auto;
      background: none;
      border: none;
      color: #fca5a5;
      cursor: pointer;
      font-size: 14px;
      padding: 0;
    }
    .toast-list {
      margin: 0;
      padding-left: 18px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .toast-list li {
      color: #fca5a5;
      font-size: 12px;
      line-height: 1.4;
    }

    /* ── Fields ── */
    .field-group { display: flex; flex-direction: column; gap: 6px; }
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
      &::placeholder { color: #6b5240; font-style: italic; }
      &:focus {
        border-color: #F5911A;
        box-shadow: 0 0 0 3px rgba(245,145,26,0.15);
      }
      &.invalid {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
      }
    }

    .field-error {
      color: #ef4444; font-size: 11.5px; margin-top: 2px; padding-left: 4px;
      line-height: 1.4; display: flex; flex-direction: column; gap: 2px;
    }

    .password-hint {
      font-size: 11px;
      color: #6b5240;
      padding-left: 4px;
      code { color: #F5911A; background: rgba(245,145,26,0.1); padding: 1px 4px; border-radius: 4px; }
    }

    .error-msg {
      background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5; padding: 10px 14px; border-radius: 8px; font-size: 13px;
    }
    .success-msg {
      background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3);
      color: #86efac; padding: 10px 14px; border-radius: 8px; font-size: 13px;
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
      &:hover:not(:disabled) { box-shadow: 0 8px 20px rgba(245,145,26,0.4); transform: translateY(-1px); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .auth-link {
      text-align: center; margin-top: 20px; color: #A89880; font-size: 14px;
      a { color: #F5911A; text-decoration: none; font-weight: 600; }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';
  toastErrors: string[] = [];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/)
      ]],
      username: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_]{3,20}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,50}$/)
      ]],
    });
  }

  /** Collect all validation errors, show toast, mark all fields touched */
  onSubmit() {
    this.registerForm.markAllAsTouched();
    this.toastErrors = [];

    const c = this.registerForm.controls;

    if (c['fullName'].invalid) {
      if (c['fullName'].errors?.['required'])      this.toastErrors.push('Full Name is required.');
      else if (c['fullName'].errors?.['minlength']) this.toastErrors.push('Full Name must be at least 2 characters.');
      else if (c['fullName'].errors?.['maxlength']) this.toastErrors.push('Full Name must be at most 50 characters.');
      else if (c['fullName'].errors?.['pattern'])   this.toastErrors.push('Full Name must contain only letters and spaces (e.g. Rahul Sharma).');
    }

    if (c['email'].invalid) {
      if (c['email'].errors?.['required']) this.toastErrors.push('Email is required.');
      else this.toastErrors.push('Email must be valid (e.g. rahul@company.com).');
    }

    if (c['username'].invalid) {
      if (c['username'].errors?.['required']) this.toastErrors.push('Username is required.');
      else this.toastErrors.push('Username must be 3–20 chars using only letters, numbers & underscores (e.g. rahul_21).');
    }

    if (c['password'].invalid) {
      if (c['password'].errors?.['required']) this.toastErrors.push('Password is required.');
      else this.toastErrors.push('Password must be 8–50 chars with a capital letter, lowercase, digit & special symbol like @ # $ (e.g. Rahul@123).');
    }

    if (this.toastErrors.length > 0) {
      setTimeout(() => { this.toastErrors = []; }, 6000);
      return;
    }

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
