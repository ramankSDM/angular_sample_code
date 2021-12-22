import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  toggle: boolean;
  loggedInAdmin: any;
  constructor(private _cookieservice: CookieService, private commonService: CommonService,
    private router: Router) { 
    this.toggle = false;
    this.loggedInAdmin = JSON.parse(this._cookieservice.get('user-starsin'));
    if (this.loggedInAdmin && !this.loggedInAdmin.image) {
      this.loggedInAdmin.image = environment.frontendURL + 'assets/img/dummyimg.png';
    }
  }

  ngOnInit(): void {
    this.commonService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'update-image' && res.value !== undefined) {
        this.loggedInAdmin.image = res.value;  
      }
    });
  }

  sidebarToggle() {
    this.toggle = !this.toggle;

    let mainSidebar: any = document.getElementById("dashboard-layout-outer");
    if(this.toggle)  mainSidebar.classList.add("sidebar-closed");
    else mainSidebar.classList.remove("sidebar-closed");
  }

  logout() {
    this._cookieservice.removeAll();
    this.loggedInAdmin = null;
    this.router.navigate(['/']);
  }
  
}
