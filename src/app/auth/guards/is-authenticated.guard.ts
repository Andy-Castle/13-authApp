import { CanActivateFn } from '@angular/router';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  
  console.log('isAuthenticatedGuard', { route, state });

  return true;
};
