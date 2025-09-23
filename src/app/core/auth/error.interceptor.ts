import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        // Handle connection refused / network errors
        if (error.status === 0) {
          console.error('Server unreachable:', error.message);
          this.router.navigate(['/login']); // redirect to login
        }

        // Handle unauthorized
        if (error.status === 401) {
          this.router.navigate(['/login']); // redirect to login
        }

        return throwError(() => error);
      })
    );
  }
}
