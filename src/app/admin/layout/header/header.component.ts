import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  toggle: boolean;
  loggedInAdmin: any;
  notificationLimit: number = 35;
  notificationData: any = [];
  unreadNotification: number = 0;
  
  constructor(private _cookieservice: CookieService, private commonService: CommonService,
    private router: Router) { 
    this.toggle = false;
    this.loggedInAdmin = JSON.parse(this._cookieservice.get('starin-admin'));
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
    this.getNotifications();
  }

  sidebarToggle() {
    this.toggle = !this.toggle;

    let mainSidebar: any = document.getElementById("dashboard-layout-outer");
    if(this.toggle)  mainSidebar.classList.add("sidebar-closed");
    else mainSidebar.classList.remove("sidebar-closed");
  }

  logout() {
    this.commonService.get("user/logout").subscribe(
      (res) => {
        localStorage.clear();
        this._cookieservice.removeAll();
        this.loggedInAdmin = null;
        this.router.navigate(['/admin/login']);

      },
      (error) => {
        console.log("error in deleting file");
      }
    );


   
  }

  loadMoreNoti() {
    this.notificationLimit = this.notificationLimit + 30;
    this.notificationData = [];
    this.getNotifications();
  } 

  getNotifications() {
    let obj = {
      count: this.notificationLimit,
      page: 1
    }
    this.commonService.queryParams("notification/get-user-notifications", obj).subscribe(
      async (res) => {
        this.notificationData = res.data.data;
        this.unreadNotification = res.data.unread;
        //this.notificationCount = res.data.total;
        console.log("++++++++++",this.notificationData)
      },
      (error) => {
        console.log("error in deleting file");
      }
    );
  }

  readNotification(data) {
    this.router.navigate(['/admin/notifications'])
    // let obj = {
    //   id: data._id
    // }
    // this.commonService.put("notification/read-notification", obj).subscribe(
    //   async (res) => {
    //     this.notificationLimit = 20;
    //     this.notificationData = [];
    //     this.getNotifications();
    //   },
    //   (error) => {
    //     console.log("error in deleting file");
    //   }
    // );
  }

}
