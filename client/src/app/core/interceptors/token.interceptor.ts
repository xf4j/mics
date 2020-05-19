import { Injectable, isDevMode } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // include token in http request if has token
    if (this.authService.isLoggedIn()) {
      request = request.clone({setHeaders: {
        'Authorization': 'JWT ' + this.authService.getToken()
      }});
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({setHeaders: {
        'Content-Type': 'application/json'
      }});
    }
    if (isDevMode) {
      console.log(request);
    }

    // response interceptor
    return next.handle(request).pipe(
      map((event: HttpEvent<any>)  => {
        return event;
      },
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }))
    );
  }
}
