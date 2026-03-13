import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn) return true;
  router.navigate(['/auth/login']);
  return false;
};

export const roleGuard = (allowedRole: string): CanActivateFn => {
  return (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isLoggedIn && auth.role === allowedRole) return true;
    if (auth.isLoggedIn) auth.redirectToRole();
    else router.navigate(['/auth/login']);
    return false;
  };
};

export const publicOnlyGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  if (!auth.isLoggedIn) return true;
  auth.redirectToRole();
  return false;
};
