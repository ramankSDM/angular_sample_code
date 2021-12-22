import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CommonService } from "../../shared/services/common.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(
    public cs: CommonService,
    public router: Router
  ){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const user = JSON.parse(localStorage.getItem('user-starsin'));
    if(this.cs.isLoggedIn !== true) {
      this.cs.logout();
      this.router.navigate(['login']);
    }
    return true;
  }

}
