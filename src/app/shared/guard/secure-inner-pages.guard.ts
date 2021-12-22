import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CommonService } from "../../shared/services/common.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SecureInnerPagesGuard implements CanActivate {

  constructor(
    public cs: CommonService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.cs.isLoggedIn) {
       const user = JSON.parse(localStorage.getItem('user-starsin'));
       if(user.role=="1"){
        this.router.navigate(['admin/dashboard']);
      }else if(user.role=="2"){
        this.router.navigate(['vendors/dashboard']);
      }else if(user.role=="3"){
        this.cs.logout();
        this.router.navigate(['/']);
      }else{
        this.cs.logout();
        this.router.navigate(['/']);
      }      
    } 
    return true;
  }

}
