import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../services/common.service';


@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private httpClient: HttpClient, private router: Router,
    private _cookieservice: CookieService, private toastr: ToastrService,
    private commonService: CommonService) { }
    async canActivate(route: ActivatedRouteSnapshot) {
    let CFUser = this._cookieservice.get('user-starsin');
    if (CFUser) {
        CFUser = JSON.parse(CFUser);
      let apiPath = `user/get-profile`;
      let verifyUser: any = await this.commonService.verifyUser(apiPath);
      if (verifyUser.data) {
        return true;
      } else {
        console.log('1');
        this.router.navigate(['/']);
        this.toastr.error('Please login to Proceed further', 'Authentication');
      }
    } else {
        console.log('2');
        this.router.navigate(['/']);
        this.toastr.error('Please login to Proceed further', 'Authentication');
      
    }

  }


}





