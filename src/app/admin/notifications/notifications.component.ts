import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  toggle: boolean;
  loggedInAdmin: any;
  notificationLimit: number = 35;
  notificationData: any = [];
  unreadNotification: number = 0;
  totalRecords: any;
  page: number;
  searchKey: any;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  sortKey: any = "";
  

  sortKeyValue: any = 'DESC';

  constructor(private spinner: NgxSpinnerService, private _cookieservice: CookieService, private commonService: CommonService, private router: Router) { 
    this.toggle = false;
    this.loggedInAdmin = JSON.parse(this._cookieservice.get('starin-admin'));
    if (this.loggedInAdmin && !this.loggedInAdmin.image) {
      this.loggedInAdmin.image = environment.frontendURL + 'assets/img/dummyimg.png';
    }
  }

  ngOnInit(): void {
    this.getNotifications()
  }

  getNotifications() {
    //this.spinner.show();
    let path = `notification/getAdminNotifications`;
    let options = {
      page: this.activePage,
      count: this.rowsOnPage, 
      search: this.searchKey || '',
      // sortBy: this.sortKey,
      // sort: this.sortKeyValue
    };

    this.commonService.queryParams(path, options).subscribe(response => {
      this.notificationData = response.data.data;
       this.totalRecords = response.data.total;
      console.log("this.notificationData", this.notificationData)
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

   searchByName(){
    this.activePage = 1;
    this.rowsOnPage = environment.LIMIT;
  }

   /*
  Name: pageChanged
  Description: when change the page from pagination,it will get new page records
  */
  pageChanged(event: any): void {
    this.activePage = event.page;
    this.getNotifications();
  }

}
