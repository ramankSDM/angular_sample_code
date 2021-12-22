import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';
// import { AuthenticationService } from '@app/_services';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(private _cookieservice: CookieService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const cokkieData = <any> this._cookieservice.get('starin-admin');
        if(cokkieData) {
            const adminData = <any>JSON.parse(cokkieData);
            if (adminData && adminData.loginToken) {
               request = request.clone({
                   setHeaders: { 
                       authorization: `${adminData.loginToken}`
                   }
               });
           }
        }
        const usercokkieData = <any> this._cookieservice.get('user-starsin');
        if(usercokkieData) {
            const userData = <any>JSON.parse(usercokkieData);
            if (userData && userData.loginToken) {
               request = request.clone({
                   setHeaders: { 
                       authorization: `${userData.loginToken}`
                   }
               });
           }
        }
        return next.handle(request);
    }
}