import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  private requestCounter = 0;

  constructor(public service: SharedService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requestCounter++;
    if (this.requestCounter === 1) {
      this.service.isLoading.next(true);
    }

    return next.handle(req).pipe(
      finalize(
        () => {
          this.requestCounter--;

          if (this.requestCounter === 0) {
            this.service.isLoading.next(false);
          }
        }
      )
    );
  }
}

