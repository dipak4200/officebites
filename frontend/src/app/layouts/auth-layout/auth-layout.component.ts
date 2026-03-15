import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <div class="auth-brand">
        <div class="brand-logo">🍽️</div>
        <h1>OfficeBites</h1>
        <p>Smart Canteen Management</p>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: radial-gradient(ellipse at top, #2a1800 0%, #0F0D0A 65%);
      padding: 24px;
    }
    .auth-brand {
      text-align: center;
      margin-bottom: 32px;
      .brand-logo { font-size: 52px; margin-bottom: 8px; }
      h1 {
        font-size: 32px;
        font-weight: 800;
        background: linear-gradient(135deg, #F5911A, #FF6B00);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      p { color: #A89880; font-size: 14px; margin-top: 4px; }
    }
  `]
})
export class AuthLayoutComponent {}
