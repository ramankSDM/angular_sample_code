import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CommonService } from "../services/common.service";
import { Observable } from 'rxjs';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class VendorGuard implements CanActivate {

  constructor(
    public cs: CommonService,
    public router: Router,
    private _location: Location
  ){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const user = JSON.parse(localStorage.getItem('user-starsin'));
    if(this.cs.isLoggedIn !== true || user.role!="2") {
      this._location.back();
    }
    return true;
  }

}
