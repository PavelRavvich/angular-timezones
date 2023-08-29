import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, retry, throwError } from "rxjs";
import { environment } from "@env/environment";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor() {
  }

  private readonly BASE_URL = environment.host;

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.apply(request))
      .pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler(error, request, next)),
        retry({ count: 3, delay: 200 })
      );
  }

  private apply(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      url: `${this.BASE_URL}${request.url}`,
    });
  }

  private errorHandler(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const status = error && error.status || 0;
    console.error(error, status, request, next);
    return throwError(() => new Error(`Error ${status}`));
  }
}
