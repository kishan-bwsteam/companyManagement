import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GlobalService } from './services/global.service';
import { Observable } from 'rxjs';




@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    // console.log(req);
    
    const token = sessionStorage.getItem("token");
    if (token) {
      const newReq = req.clone({
        headers: req.headers.append('Authrization', token),
      });
      return handler.handle(newReq);
    }
    return handler.handle(req);
  }
}