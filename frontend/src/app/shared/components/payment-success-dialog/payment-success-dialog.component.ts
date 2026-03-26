import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-payment-success-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="success-dialog">
      <div class="success-icon">
        <mat-icon style="font-size: 64px; height: 64px; width: 64px; color: #4ade80;">check_circle</mat-icon>
      </div>
      <h2 mat-dialog-title>Payment Done!</h2>
      <mat-dialog-content>
        <p>Your dummy payment was processed successfully.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="center" style="display: flex; justify-content: center; padding-bottom: 20px;">
        <button mat-raised-button color="primary" (click)="done()">Done</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .success-dialog { background: #1e293b; color: #f1f5f9; border-radius: 8px; text-align: center; padding-top: 20px; }
    ::ng-deep .mat-mdc-dialog-container { background-color: #1e293b !important; color: #f1f5f9; }
    h2 { color: #f1f5f9; margin-bottom: 5px; }
    .success-icon { margin-bottom: 10px; }
  `]
})
export class PaymentSuccessDialogComponent {
  constructor(public dialogRef: MatDialogRef<PaymentSuccessDialogComponent>) {}
  done() { this.dialogRef.close(true); }
}
