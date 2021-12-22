import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../../environments/environment';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  loggedInAdmin: any;
  constructor(private _cookieservice: CookieService,
    private commonService: CommonService) {
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

}
