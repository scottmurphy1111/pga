import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { tap } from 'rxjs/operators';

import { RequestCacheService } from './request-cache.service';

@Injectable({
  providedIn: 'root'
})
export class CachingInterceptorService implements HttpInterceptor {

  constructor(private cache: RequestCacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('req', req);
    console.log('next', next);
    const cachedResponse = this.cache.get(req);
    console.log('cr', this.cache.get(req));
    return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next, this.cache);
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: RequestCacheService): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            cache.put(req, event);
          }
        })
      );
    }
}
