import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        // Log successful responses
        if (event instanceof HttpResponse) {
          console.log(`API Response [${request.method}] ${request.url}:`, event.body);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(`API Error [${request.method}] ${request.url}:`, error);
        
        // Log the actual response body if available
        if (error.error) {
          if (typeof error.error === 'string') {
            console.error('Response body:', error.error.substring(0, 500)); // Log first 500 chars
          }
        }

        // Handle different error types
        let errorMessage = 'An error occurred';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          
          // Check if response is HTML (common when endpoint doesn't exist)
          if (error.status === 404) {
            errorMessage = 'Endpoint not found (404). Check the API URL and endpoint path.';
          } else if (error.status === 0) {
            errorMessage = 'Network error or CORS issue. Check if the backend server is running.';
          }
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
