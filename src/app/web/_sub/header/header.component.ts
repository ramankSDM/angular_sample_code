import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "./../../../shared/services/common.service";
import { DataService } from "./../../../services/data.service";
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "./../../../auth/login/login.component";
import { SignupComponent } from "./../../../auth/signup/signup.component";
import { Subject } from "rxjs";
import { ChatService } from "../../../shared/services/chat.service";
import { CookieService } from 'ngx-cookie';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {SelectRoleComponent} from '../select-role/select-role.component'
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  providers: [NgbModal],
})
export class HeaderComponent implements OnInit {
  selectedLang: any = 'en';
  langs: any = [];
  searchInputUpdate = new Subject<string>();
  title = "Your Orders";
  subTitle = "";
  locationMsg: string = null
  closeResult: string;
  modalOptions: NgbModalOptions;
  cartArr: any;
  cartFinalArr: any;
  mediaCss = false;
  loginUser: any;
  cartCount = 0;
  showCart: boolean = false;
  showCartIcon: boolean = false;
  search = "";
  selectedKeywords: string;
  notificationOpen: boolean = false;
  notifications: any;
  notificationCount: number = 0;
  notificationLimit: number = 35;
  notificationData: any = [];
  unreadNotification: number = 0;
  searchData: any = [];
  categoryList: any = [];
  showsearchBox: boolean = false;
  count: any;
  notify: Boolean = false;
  isLocation: boolean = false;
  isDate: boolean = false;
  date9: Date;
  selectedDate: any;
  selectedLocation: any;
  formated_address: any;
  latLong = [];
  now = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 1,
    new Date().getHours(),
    new Date().getMinutes() > 30 ? 0 : 30
  );
  s: Boolean = false;
  max = new Date(
    this.now.getFullYear() + 1,
    11,
    31,
    this.now.getHours(),
    new Date().getMinutes() > 30 ? 0 : 30
  );
  selectedCountry: any;

  searchDataSelect: any[];

  filteredSeachData: any[];

  selectedCountryAdvanced: any[];

  filteredBrands: any[];
  changeText: boolean;
  isReviwed: boolean = false;
  constructor(
    public cs: CommonService,
    public ds: DataService,
    private modalService: NgbModal,
    public router: Router,
    public _chatService: ChatService,
    private _cookieservice: CookieService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.changeText = false;
    this.modalOptions = {
      backdrop: "static",
      backdropClass: "customBackdrop",
    };
    this.ds.setProfile.subscribe((data) => {
      this.loginUser = JSON.parse(this._cookieservice.get("user-starsin"));
      if (data) {
        this.loginUser.image = data.image
        this.isReviwed = data.isReviewed;
        this.getNotifications();
      }
    })
    if(this.loginUser){
      this._chatService.deactiveUser().subscribe((data) => {
        this.getNotifications()
        this.toastr.success(data.message)
      });
      this._chatService.activeUser().subscribe((data) => {
        this.getNotifications()
        this.toastr.success(data.message)
      });
      this._chatService.followUser().subscribe((data) => {
        this.getNotifications()
        this.toastr.success(data.message)
      });
      this._chatService.unfollowUser().subscribe((data) => {
        this.getNotifications()
        this.toastr.success(data.message)
      });
      this._chatService.assignPromo().subscribe((data) => {
        this.getNotifications()
        this.toastr.success(data.message)
      });
      this._chatService.createBooking().subscribe((data) => {
        this.getNotifications()
        this.toastr.success(data.message)
      });
      this._chatService.acceptBooking().subscribe((data) => {
        this.getNotifications()
        this.toastr.success(data.message)
      });
      this._chatService.rejectBooking().subscribe((data) => {
        this.getNotifications()
        this.toastr.success(data.message)
      });
      this._chatService.cancelBooking().subscribe((data) => {
        this.getNotifications()
        this.toastr.success(data.message)
      });
      this._chatService.postponeBooking().subscribe((data) => {
        this.getNotifications()
        this.toastr.success(data.message)
      });
      this._chatService.completeBooking().subscribe((data) => {
        this.getNotifications()
        this.toastr.success(data.message)
      });
      this._chatService.bookingReminder().subscribe((data) => {
        this.getNotifications()
        this.toastr.success(data.message)
      });
    }
    if(this._cookieservice.get("user-starsin")){
        let loginData = JSON.parse(this._cookieservice.get("user-starsin"));
        if(loginData && loginData.role == null){
          const modalRef = this.modalService.open(SelectRoleComponent, {
            windowClass: "modal-holder",
          });
          modalRef.componentInstance.title = "Login";
        }
    }
   
    
  }

  async ngOnInit() {
    this.getHeadTags();
    this.getProfile();
    this.langs = [{ name: 'English', code: 'en' }, { name: 'Arabic', code: 'ar' }];
    this.selectedLang = localStorage.currentLang ? localStorage.currentLang : 'en'
    this.ds.get().subscribe(async (data) => {
      if (data.key == "currentLang") {
        this.selectedLang = data.set;
        this.translate.use(this.selectedLang)
      }
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLang = this.translate.currentLang ? this.translate.currentLang : 'en';
    });

    this.getCategories();
    this.ds.get().subscribe(async data => {
      if (data.key == "locationMsg") {
        this.locationMsg = data.set
      }
    });
    this.loginUser = this._cookieservice.get("user-starsin");
    if (this.loginUser) {
      this.loginUser = JSON.parse(this.loginUser);
      this.getNotifications()
      
    }

  }
  
  getProfile() {
    let apiPath = `user/get-profile`;
    return new Promise((resolve, reject) => {
      this.cs.get(apiPath).subscribe(async res => {
        this.isReviwed = res.data.isReviewed;
      },
        (err) => {
          this.cs.loading(false)
        }
      );
    });
  }

  setLang(lang) {
    this.selectedLang = lang
    this.translate.use(lang);
    localStorage.currentLang = lang;
    this.ds.set(lang, "currentLang");
  }

  mediaFunction(mediaCssChange) {
    this.mediaCss = !mediaCssChange;
  }

  onLoggedout() {
    this.cs.get("user/logout").subscribe(
      (res) => {
        //localStorage.clear();
        this._cookieservice.removeAll();
        this.ds.set("", "isLoggedInUser");
        this.loginUser = JSON.parse(localStorage.getItem("user-starsin"));
        this.router.navigate(['/']);
      },
      (error) => {
        console.log("error in deleting file");
      }
    );
  }

  /*login popup calling*/
  login() {
    const modalRef = this.modalService.open(LoginComponent, {
      windowClass: "modal-holder",
    });
    modalRef.componentInstance.title = "Login";
  }
  /*signup popup calling*/
  signUp() {
    const modalRef = this.modalService.open(SignupComponent, {
      windowClass: "modal-holder",
    });
    modalRef.componentInstance.title = "Signup";
  }


  status: boolean = false;
  clickEvent() {
    this.status = !this.status;
  }

  openSearchBox() {
    this.showsearchBox = !this.showsearchBox;
  }


  getNotifications() {
    let obj = {
      count: this.notificationLimit,
      page: 1
    }
    this.cs.queryParams("notification/get-user-notifications", obj).subscribe(
      async (res) => {
        this.notificationData = res.data.data;
        this.unreadNotification = res.data.unread;
        this.notificationCount = res.data.total;
        // console.log(this.notificationData)
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

  redirectFanURL(requestType){
    if (this.loginUser.role == 3) {
      if (requestType == 1) {
        this.router.navigate(['/celebrity/my-booking/shoutout'])
      } else if(requestType == 2) {
        this.router.navigate(['/celebrity/my-booking/i-got-talent'])
      } else if(requestType == 3) {
        this.router.navigate(['/celebrity/my-booking/webinar'])
      } else if(requestType == 4) {
        this.router.navigate(['/celebrity/my-booking/schedule-meetings'])
      }
      else if(requestType == 5) {
        this.router.navigate(['/celebrity/my-booking/dm'])
      }
    }
    if (this.loginUser.role == 2) {
    if (requestType == 1) {
      this.router.navigate(['/fans/my-booking/shoutout'])
    } else if(requestType == 2) {
      this.router.navigate(['/fans/my-booking/i-got-talent'])
    } else if(requestType == 3) {
      this.router.navigate(['/fans/my-booking/webinar'])
    } else if(requestType == 4) {
      this.router.navigate(['/fans/my-booking/schedule-meetings'])
    }
    else if(requestType == 5) {
      this.router.navigate(['/fans/my-booking/dm'])
    }
  }
  }

  readNotification(data) {
    if (data.isRead == false) {     
      let obj = {
        id: data._id
      }
      this.cs.put("notification/read-notification", obj).subscribe(
        async (res) => {
          this.notificationLimit = 20;
          this.notificationData = [];
          this.getNotifications();
          if (data.type == "FOLLOW") {
            this.router.navigate(['/celebrity/fans']);
          }
          if (data.type == "UNFOLLOW") {
            this.router.navigate(['/celebrity/fans']);
          }
          // if (data.type == "DEACTIVATE_USER") {

          // }
          // if (data.type == "ACTIVE_USER") {

          // }
          if (data.type == "ASSIGN_PROMO_CODE") {
            this.router.navigate(['/fans/promo-codes'])
          }
          if (data.type == "CREATE_REQUEST") {
            this.redirectFanURL(data.bookingId.requestType);
          }
          if (data.type == "ACCEPT_REQUEST") {
            this.redirectFanURL(data.bookingId.requestType);

          }
          if (data.type == "REJECT_REQUEST") {
            this.redirectFanURL(data.bookingId.requestType);

          }
          if (data.type == "CANCEL_REQUEST") {
            this.redirectFanURL(data.bookingId.requestType);
          }
          if (data.type == "POSTPONE_REQUEST") {
            this.redirectFanURL(data.bookingId.requestType);


          }
          if (data.type == "COMPLETE_REQUEST") {
            this.redirectFanURL(data.bookingId.requestType);
          }
          if (data.type == "BOOKING_REMINDER") {
            this.redirectFanURL(data.bookingId.requestType);
          }
          if (data.type == "DM_STATUS") {
            this.router.navigate(['fans/my-booking/dm'])
          }

        },
        (error) => {
          console.log("error in deleting file");
        }
      );
    } else {
      this.notificationLimit = 20;
      this.notificationData = [];
      this.getNotifications();
      if (data.type == "FOLLOW") {
        this.router.navigate(['/celebrity/fans']);
      }
      if (data.type == "UNFOLLOW") {
        this.router.navigate(['/celebrity/fans']);
      }
      if (data.type == "ASSIGN_PROMO_CODE") {
        this.router.navigate(['/fans/promo-codes'])
      }
      if (data.type == "CREATE_REQUEST") {
        this.redirectFanURL(data.bookingId.requestType);
      }
      if (data.type == "ACCEPT_REQUEST") {
        this.redirectFanURL(data.bookingId.requestType);

      }
      if (data.type == "REJECT_REQUEST") {
        this.redirectFanURL(data.bookingId.requestType);

      }
      if (data.type == "CANCEL_REQUEST") {
        this.redirectFanURL(data.bookingId.requestType);
      }
      if (data.type == "POSTPONE_REQUEST") {
        this.redirectFanURL(data.bookingId.requestType);
      }
      if (data.type == "COMPLETE_REQUEST") {
        this.redirectFanURL(data.bookingId.requestType);
      }
      if (data.type == "BOOKING_REMINDER") {
        this.redirectFanURL(data.bookingId.requestType);
      }
    }
  }

  closeLocationDiv() {
    this.locationMsg = null
  }

  getCategories() {
    this.cs.get("category/get-all").subscribe(
      async (res) => {
        if(res && res.data && res.data.data){
        res.data.data.forEach((element,i) => {
          if(i<=5){
            this.categoryList.push(element)
          }          
        });
      }
        // this.categoryList = res.data.data;
      },
      (error) => {
        console.log("error in deleting file");
      }
    );
  }

  async getHeadTags() {
    this.cs.get("tags/get-home-tag").subscribe(
      async (res) => {
        let pp = [];
        if (res.data) {
          await res.data.map(function (d, i) {
            if (d && d.tagData[i] && d.tagData[i].userData && d.tagData[i].userData[0]) {
              pp.push({ "name": d.tagData[i].userData[0].fname_en, "slug": d.tagData[i].userData[0].slug, "image": d.tagData[i].userData[0].image });
            }

          })
        }
        this.searchDataSelect = pp;
      },
      (error) => {
        console.log("error in deleting file");
      }
    );

  }

  filterKeyupSearch(event) {
    if (event.query) {
      var obj = {
        name: event.query
      }
      this.cs.queryParams("user/get-all-celebrities", obj).subscribe(
        async (res) => {
          let filtered: any[] = res.data
          if (res.data) {
            filtered = res.data;
            this.filteredBrands = filtered
          }
        },
        (error) => {
          console.log("error in deleting file");
        }
      );

    }
  }

}
