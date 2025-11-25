import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

@Injectable()
export class DisableCacheInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const httpRequest = req.clone({
      headers: req.headers.append('Cache-Control', 'no-cache').append('Pragma', 'no-cache')
    });

    return next.handle(httpRequest);
  }
}
