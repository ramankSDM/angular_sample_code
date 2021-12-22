import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../../environments/environment';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  loggedInAdmin: any;
  isDashbaordTab: boolean = false;
  isCategoriesTab: boolean = false;
  isTagsTab: boolean = false;
  isSubAdminTab: boolean = false;
  isCelebritiesTab: boolean = false;
  isFansTab: boolean = false;
  isBlockedFanTab: boolean = false;
  isBookingTab: boolean = false;
  isRefundTab: boolean = false;
  isPromotionTab: boolean = false;
  isRatingTab: boolean = false;
  isPageTab: boolean = false;
  isFaqTab: boolean = false;
  isTicketTab: boolean = false;
  constructor(private _cookieservice: CookieService,
    private commonService: CommonService) {
    this.loggedInAdmin = JSON.parse(this._cookieservice.get('starin-admin'));
    if (this.loggedInAdmin) {
      if (this.loggedInAdmin.role == 1) {
        this.isDashbaordTab = true;
        this.isCategoriesTab = true;
        this.isTagsTab = true;
        this.isSubAdminTab = true;
        this.isCelebritiesTab = true;
        this.isFansTab = true;
        this.isBlockedFanTab = true;
        this.isBookingTab = true;
        this.isRefundTab = true;
        this.isPromotionTab = true;
        this.isRatingTab = true;

        this.isPageTab = true;
        this.isFaqTab = true;
        this.isTicketTab = true;
      } else {
        for (let i = 0; i < this.loggedInAdmin.permissionData.length; i++) {
          if(this.loggedInAdmin.permissionData[i].permissionId.name == 'Fan Management') {
            this.isFansTab = true;
          }
          if(this.loggedInAdmin.permissionData[i].permissionId.name == 'Celebrity Management') {
            this.isCelebritiesTab = true;
          }
          if(this.loggedInAdmin.permissionData[i].permissionId.name == 'Categories Management') {
            this.isCategoriesTab = true;
          }
          if(this.loggedInAdmin.permissionData[i].permissionId.name == 'Tags Mangement') {
            this.isTagsTab = true;
          }
          if(this.loggedInAdmin.permissionData[i].permissionId.name == 'Booking Management') {
            this.isBookingTab = true;
          }
          if(this.loggedInAdmin.permissionData[i].permissionId.name == 'Refund Request') {
            this.isRefundTab = true;
          }
          if(this.loggedInAdmin.permissionData[i].permissionId.name == 'Promotions') {
            this.isPromotionTab = true;
          }
          if(this.loggedInAdmin.permissionData[i].permissionId.name == 'rating') {
            this.isRatingTab = true;
          }
          if(this.loggedInAdmin.permissionData[i].permissionId.name == 'Manage Pages') {
            this.isPageTab = true;
          }
          if(this.loggedInAdmin.permissionData[i].permissionId.name == 'Manage Faq') {
            this.isFaqTab = true;
          }
          if(this.loggedInAdmin.permissionData[i].permissionId.name == 'Support Tickets') {
            this.isTicketTab = true;
          }
        }
      }
    }


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
