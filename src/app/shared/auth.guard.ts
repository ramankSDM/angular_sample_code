import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../services/common.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private httpClient: HttpClient, private router: Router,
    private _cookieservice: CookieService, private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService) { }
  async canActivate(route: ActivatedRouteSnapshot) {
    let loggedInUser = this._cookieservice.get('starin-admin');
    if (loggedInUser) {
      loggedInUser = JSON.parse(loggedInUser);
      let apiPath = `user/get-profile`;
      let verifyUser: any = await this.commonService.verifyUser(apiPath);
      if (verifyUser.data) {
        
        return true;
      } else {
        this.router.navigate(['/admin/login']);
        this.toastr.error('Please login to Proceed further', 'Authentication');
      }
    } else {
      this.router.navigate(['/admin/login']);
      // this.toastr.error('Please login to Proceed further', 'Authentication');
    }

  }


}





