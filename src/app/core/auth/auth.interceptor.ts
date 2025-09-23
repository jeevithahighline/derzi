import {
  HttpEvent,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthUtils } from './auth.utils';
import { Router } from '@angular/router';

export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  let newReq = req.clone();

  // Add Authorization header if token exists & is valid
  if (
    authService.accessToken &&
    !AuthUtils.isTokenExpired(authService.accessToken)
  ) {
    newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.accessToken}`,
      },
    });
  }

  return next(newReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        // 🚨 Case 1: Server unreachable (connection refused, CORS fail, etc.)
        if (error.status === 0) {
          console.error('Server unreachable:', error.message);
          authService.logout?.();
          localStorage.removeItem('accessToken');
          // Redirect to login (instead of reload)
          router.navigate(['/sign-in']);
        }

        // 🚨 Case 2: Unauthorized
        if (error.status === 401) {
          authService.logout?.();
          localStorage.removeItem('accessToken');
          // Redirect to login
          router.navigate(['/sign-in']);
        }
      }

      return throwError(() => error);
    })
  );
};
