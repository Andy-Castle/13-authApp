import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  // const url = state.url;
  // localStorage.setItem('url', url);
  // console.log('isAuthenticatedGuard', { route, state });
  const authService = inject(AuthService);

  // console.log({ status: authService.authStatus() });

  if (authService.authStatus() == AuthStatus.authenticated) {
    return true;
  }

  const router = inject(Router);
  // const url = state.url;
  // localStorage.setItem('url', url);
  router.navigateByUrl('/auth/login');

  return false;
};
