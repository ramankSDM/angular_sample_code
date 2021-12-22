import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  NgxSpinnerService
} from 'ngx-spinner';
import {
  BsModalService,
  BsModalRef
} from 'ngx-bootstrap/modal';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  ToastrService
} from 'ngx-toastr';
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import {
  CommonService
} from 'src/app/services/common.service';
import {
  CookieService
} from 'ngx-cookie';
import {
  environment
} from 'src/environments/environment';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {
  formatDate,
  DatePipe
} from '@angular/common';
import {
  LoginComponent
} from "./../../auth/login/login.component";
import {
  CalendarOptions
} from '@fullcalendar/angular'; // useful for typechecking
import {
  ReviewComponent
} from '../_model/review/review.component';
import {
  DataService
} from 'src/app/services/data.service';
import {
  TranslateService,
  LangChangeEvent
} from '@ngx-translate/core';
import {
  StripeService,
  StripeCardComponent
} from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js'
@Component({
  selector: 'app-webinars',
  templateUrl: './webinars.component.html',
  styleUrls: ['./webinars.component.scss'],
  providers: [NgbModal],
})
export class WebinarsComponent implements OnInit {
  @ViewChild("viewCalendarPop") viewCalendarPop: ElementRef;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  frm: FormGroup;
  isSubmited: boolean = false;

  slug: any;
  celebInfo: any;

  dataList: any;
  webinarList: any;
  page: number;
  searchKey: any;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  sortKey: any = "_id";
  sortKeyValue: any = 'DESC';
  filterParams: any;
  filterStatus: any;
  viewData: any;
  totalRecords: any;
  fanDetail: any;
  selectedLang: any = 'en';
  langs: any = [];
  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  requestType: any = '';

  applyCodeButton = 'false';
  applyCouponDiv = 'false';
  appliedCode = '';
  couponList: any;
  bookedButton = '';
  payAmount = 'true';
  existWebinars: any;
  existWebinars2: any;
  loggedIn = 'false';
  events: any = [];
  calendarOptions: any;

  showCardDetail = true
  cardDetail: any
  newCard = false
  cardCharges = 0
  walletCharges = 0
  loginUser: any

  constructor(private spinner: NgxSpinnerService, private _cookieservice: CookieService, private ngModalService: NgbModal, private modalService: BsModalService, private nbModalService: NgbModal,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private commonService: CommonService, private fb: FormBuilder, public ds: DataService, private translate: TranslateService, private stripeService: StripeService) {
    this.page = 1;
    this.searchKey = '';
    this.filterStatus = '';
    this.filterParams = '';
    this.existWebinars = [];
    this.existWebinars2 = [];
  }

  ngOnInit(): void {
    let user = this._cookieservice.get('user-starsin');
    if (user) {
      this.loggedIn = 'true';
    }

    this.frm = this.fb.group({ // form 
      celebrityId: [''],
      fanName: [''],
      webinar_id: [''],
      number_of_participants: [''],
      zoomBookingDateTime: [''],
      totalAmount: [''],
      subTotalAmount: [''],
      discountAmount: [0],
      promoCode: [''],
      occasion: [''],
      available_wallet_points: [''],
      use_points: true,
      webinarType: ['attend'],
      terms: ['', [Validators.required]],
      fan_info: ['', [Validators.required]],
      card: [''],
      newCard: [''],
      cardName: ['']
    });

    this.loginUser = this._cookieservice.get("user-starsin");
    if (this.loginUser) {
      this.loginUser = JSON.parse(this.loginUser);
    }

    let CFUser = this._cookieservice.get('user-starsin');
    if (CFUser) {
      let NewCFUser = JSON.parse(CFUser);
      let userId = NewCFUser._id;

      let apiPath = `user/get-profile`;
      this.commonService.get(apiPath).subscribe(result => {
        this.fanDetail = result.data;

      }, err => {
        this.commonService.handleError(err);
      });
      let userName = NewCFUser.fname_en + ' ' + NewCFUser.lname_en;
      this.frm.controls["fanName"].setValue(userName);
      let promoPath = `promoCode/get-all-promoShareCode`;
      let promoOptions = {
        id: userId,
        page: 1,
        count: 50
      };
      this.commonService.queryParams(promoPath, promoOptions).subscribe(response => {
        this.couponList = response.data.data;
      }, err => {
        this.commonService.handleError(err);
      });

      if (userId) {
        this.getFanWebinars();
      }
      let webinarApiPath = `celebrities/getUserWebinar`;
      let wOptions = {
        _date: ''
      };
      this.commonService.queryParams(webinarApiPath, wOptions).subscribe(response => {
        this.events = response.data.data;
        // console.log('this.userWebinarList11',this.events); 
        this.calendarOptions = {
          initialView: 'dayGridMonth',
          eventClick: this.handleEventClick.bind(this), // bind is important!
          dateClick: this.handleDateClick.bind(this), // bind is important!
          header: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
          events: this.events
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      });

      // this.events = [
      //   { 
      //     id: '1221',
      //     title: 'event 1', 
      //     start: "2021-04-27T18:30:00",
      //     end: "2021-04-27T18:30:00.000Z"  
      //     //"start": "2021-04-16",
      //     //"end": "2021-04-18"      
      //   },
      //   { 
      //     id: '1221',
      //     title: 'event 4', 
      //     start: "2021-04-16T18:00:00",
      //     end: "2021-04-16T22:00:00"  
      //     //"start": "2021-04-16",
      //     //"end": "2021-04-18"      
      //   },
      //   { id: '100', title: 'event 2', date: '2021-04-12' }
      // ];
      // console.log('this.events22',this.events);  

    }
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['slug']) {
        this.slug = params['slug'];
      } else {
        this.slug = '';
      }

    });
    this.getWebinars();
    this.getUserCardInfo()
    this.langs = [{
      name: 'English',
      code: 'en'
    }, {
      name: 'Arabic',
      code: 'ar'
    }];
    this.selectedLang = localStorage.currentLang ? localStorage.currentLang : 'en' // here getting the selected language
    this.ds.get().subscribe(async (data) => {
      if (data.key == "currentLang") {
        this.selectedLang = data.set;
        this.translate.use(this.selectedLang)
      }
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLang = this.translate.currentLang ? this.translate.currentLang : 'en';
    });
  }

  /*
  Name: getFanWebinars
  Description: Get list of Fan webinars.
  */
  getFanWebinars() {
    let path = `booking/get-all`;
    let options = {
      type: 3,
      page: 1,
      count: 100,
      search: '',
      status: ''
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.dataList = response.data.data;
      this.dataList.forEach((element) => {
        this.existWebinars.push({
          '_id': element.webinar_id
        });
      });
      this.existWebinars2 = [...new Set(this.existWebinars.map(item => item._id))];
    }, err => {
      this.commonService.handleError(err);
    });
  }

  /*
  Name: getWebinars
  Description: Get list of Celebrity webinars.
  */
  getWebinars() {
    if (this.slug != '') {
      let path = `celebrity/${this.slug}`;
      this.commonService.get(path).subscribe(response => {
        this.celebInfo = response.data[0];
        let celebrityInfo = JSON.stringify(this.celebInfo);
        let NewCFUser = JSON.parse(celebrityInfo);
        let apiPath = `celebrities/get-webinar`;
        let options = {
          page: this.activePage,
          count: this.rowsOnPage,
          search: this.searchKey,
          sortBy: this.sortKey,
          sort: this.sortKeyValue,
          status: true,
          celebrity_id: NewCFUser._id
        };
        this.commonService.queryParams(apiPath, options).subscribe(response => {
          this.webinarList = response.data.data;
          // this.totalRecords = response.data.total;
          this.totalRecords = this.webinarList.length;
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.commonService.handleError(err);
        });
      });
    } else {
      let apiPath2 = `celebrities/get-webinar`;
      let options2 = {
        page: this.activePage,
        count: this.rowsOnPage,
        search: this.searchKey,
        sortBy: this.sortKey,
        sort: this.sortKeyValue,
        status: true
      };
      this.commonService.queryParams(apiPath2, options2).subscribe(response => {
        this.webinarList = response.data.data;
        // console.log('this.dataList all',this.webinarList)
        this.totalRecords = response.data.total;
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      });
    }

  }

  /*
  Name: pageChanged
  Description: when change the page from pagination,it will get new page records
  */
  pageChanged(event: any): void {
    //this.page = event.page;
    this.activePage = event.page;

    //alert("page "+ this.activePage);
    //alert("rowsOnPage "+ this.rowsOnPage)
    this.getWebinars();
  }

  /*
  Name: openModal
  Description: Open popup click on View button
  */
  openModal(template: TemplateRef < any > , data) {
    let CFUser = this._cookieservice.get('user-starsin');
    if (!CFUser) {
      this._cookieservice.put('service', 'zoomcall');
      const modalRef = this.ngModalService.open(LoginComponent, {
        backdrop: 'static',
        keyboard: false,
        windowClass: "modal-holder",
      });
      modalRef.componentInstance.title = "Login";
      this.spinner.hide();
    } else {
      this.modalRef = this.modalService.show(template);
      this.viewData = data;
      this.frm.controls["totalAmount"].setValue(this.viewData.booked_price);
      this.frm.controls["subTotalAmount"].setValue(this.viewData.booked_price);
      this.frm.controls["celebrityId"].setValue(this.viewData.celebrity_id._id);
      this.frm.controls["occasion"].setValue(this.viewData.topic);
      this.frm.controls["webinar_id"].setValue(this.viewData._id);
      this.frm.controls["number_of_participants"].setValue(this.viewData.number_of_participants);
      // if (this.fanDetail.available_wallet_points > 0) {
      //     this.frm.controls["available_wallet_points"].setValue(this.fanDetail.available_wallet_points);
      //     // console.log("this.dataList.price",this.viewData.booked_price, " hhhh", this.fanDetail.available_wallet_points)
      //     if (this.viewData.booked_price < this.fanDetail.available_wallet_points) {
      //       this.showCardDetail = false
      //       this.walletCharges = this.viewData.booked_price
      //     } else {
      //       this.cardCharges = Math.abs(this.viewData.booked_price - this.fanDetail.available_wallet_points)
      //       this.walletCharges = this.fanDetail.available_wallet_points
      //     }
      // } else {
      //   this.frm.controls["available_wallet_points"].setValue(0);
      //   this.frm.controls["use_points"].setValue(false);
      //   this.cardCharges = this.fanDetail.available_wallet_points
      // }
      if (this.fanDetail.available_wallet_points > 0) {
        this.frm.controls["available_wallet_points"].setValue(this.fanDetail.available_wallet_points);
        if (this.viewData.booked_price < this.fanDetail.available_wallet_points) {
          this.showCardDetail = false
          this.walletCharges = this.viewData.booked_price
        } else {
          this.cardCharges = Math.abs(this.viewData.booked_price - this.fanDetail.available_wallet_points)
          this.walletCharges = this.fanDetail.available_wallet_points
        }
      } else {
        this.frm.controls["available_wallet_points"].setValue(0);
        this.frm.controls["use_points"].setValue(false);
        this.cardCharges = this.viewData.booked_price
        this.showCardDetail = true
      }




      let zoom = this.viewData.webinar_date;
      this.frm.controls["zoomBookingDateTime"].setValue(zoom);
    }
  }

  /*
  Name: closeModal
  Description: Close the View popup
  */
  closeModal() {
    this.modalRef.hide();
  }

  /*
  Name: save
  Description: Submit the zoomcall request
  */
  save() {
    this.spinner.show();
    if (this.frm.invalid) {
      this.spinner.hide()
      this.isSubmited = true;
      return;
    }
    this.add();
  }

  /*
  Name: add
  Description: Save the request into database
  */
  add() {
    this.spinner.show();
    this.frm.value.requestType = 3; //Webinar
    //return
    if (this.frm.value.use_points == true) {
      this.frm.value.wallet_points = this.walletCharges
      this.frm.value.available_wallet_points = Math.abs(this.fanDetail.available_wallet_points - this.walletCharges)
    } else {
      this.frm.value.wallet_points = 0
      this.frm.value.available_wallet_points = Math.abs(this.fanDetail.available_wallet_points - this.walletCharges)
    }
    this.frm.value.card_points = this.cardCharges

    delete this.frm.value.use_points;
    // delete this.frm.value.available_wallet_points;
    delete this.frm.value.terms;
    //delete this.frm.value.wallet
    delete this.frm.value.card
    delete this.frm.value.newCard

    if (this.showCardDetail) {
      if (this.newCard) {
        let payment = this.makeNewCardPayment()
      } else {
        let payment = this.makePayment()
      }
    }

    let path = 'booking/addBooking';
    this.commonService.post(path, this.frm.value).subscribe(res => {
        if (res.status == 200) {
          this.spinner.hide()
          this.modalRef.hide();
          //this.toastr.success(res.message); 
          this.toastr.success('Thanks for the Request. A copy of the details has been sent to your email.');
          this.bookedButton = res.data.webinar_id;

          let obj = {
            id: this.dataList._id,
          }
          const modalRef = this.nbModalService.open(ReviewComponent, {
            backdrop: 'static',
            keyboard: false,
            windowClass: "modal-holder",
          });
          modalRef.componentInstance.reviewData = res.data;
        } else {
          this.spinner.hide()
          this.toastr.error(res.message);
        }
      },
      (err) => {
        this.spinner.hide()
        this.toastr.error(err.error.message);
        this.modalRef.hide();
      }
    );
  }

  /*
  Name: applyCode
  Description: Apply the promo code if available
  */
  applyCode(code) {
    this.spinner.show()
    let path = 'promoCode/apply';
    let options = {
      totalAmount: this.frm.value.totalAmount,
      promoCode: code
    };
    this.commonService.post(path, options).subscribe(response => {
      if (response.data.message) {
        this.toastr.error(response.data.message);
      } else {
        if (this.fanDetail.available_wallet_points > 0) {
          if (this.frm.value.totalAmount < this.fanDetail.available_wallet_points) {
            this.showCardDetail = false
            this.walletCharges = response.data.total_amount
          } else {
            this.cardCharges = Math.abs(response.data.total_amount - this.fanDetail.available_wallet_points)
            this.walletCharges = this.fanDetail.available_wallet_points
          }
        } else {
          this.frm.controls["available_wallet_points"].setValue(0);
          this.frm.controls["use_points"].setValue(false);
          this.cardCharges = response.data.total_amount
          this.showCardDetail = true
        }

        this.frm.controls["totalAmount"].setValue(response.data.total_amount);
        this.frm.controls["subTotalAmount"].setValue(response.data.sub_total_amount);
        this.frm.controls["discountAmount"].setValue(response.data.discounted_amount);
        this.applyCodeButton = 'true';
        this.appliedCode = code;

        this.toastr.success(response.message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: removeCode
  Description: Remove the applied coupon
  */
  removeCode(code) {
    this.spinner.show()
    this.frm.controls["totalAmount"].setValue(this.frm.value.subTotalAmount);
    this.frm.controls["subTotalAmount"].setValue(this.frm.value.subTotalAmount);
    this.frm.controls["discountAmount"].setValue('0');
    this.frm.controls["promoCode"].setValue('');
    this.applyCodeButton = 'false';
    this.appliedCode = '';

    if (this.fanDetail.available_wallet_points > 0) {
      if (this.frm.value.totalAmount < this.fanDetail.available_wallet_points) {
        this.showCardDetail = false
        this.walletCharges = this.frm.value.totalAmount
      } else {
        this.cardCharges = Math.abs(this.frm.value.totalAmount - this.fanDetail.available_wallet_points)
        this.walletCharges = this.fanDetail.available_wallet_points
      }
    } else {
      this.frm.controls["available_wallet_points"].setValue(0);
      this.frm.controls["use_points"].setValue(false);
      this.cardCharges = this.frm.value.totalAmount
      this.showCardDetail = true
    }

    this.toastr.success('Removed Successfully');
    this.spinner.hide();
  }

  /*
  Name: showCoupon
  Description: Show the available coupons for fan
  */
  showCoupon() {
    this.applyCouponDiv = 'true';
    return false;
  }

  /*
  Name: changeType
  Description: Change webinar type
  */
  changeType(type) {
    this.frm.controls["promoCode"].setValue('');
    this.applyCodeButton = 'false';
    this.appliedCode = '';
    if (type == 'attend') {
      this.payAmount = 'true';
      this.frm.controls["webinarType"].setValue('attend');
      this.frm.controls["totalAmount"].setValue(this.viewData.booked_price);
      this.frm.controls["subTotalAmount"].setValue(this.viewData.booked_price);
      this.frm.controls["use_points"].setValue(true);
      if (this.fanDetail.available_wallet_points > 0) {
        this.frm.controls["available_wallet_points"].setValue(this.fanDetail.available_wallet_points);
        if (this.viewData.booked_price < this.fanDetail.available_wallet_points) {
          this.showCardDetail = false
          this.walletCharges = this.viewData.booked_price
        } else {
          this.cardCharges = Math.abs(this.viewData.booked_price - this.fanDetail.available_wallet_points)
          this.walletCharges = this.fanDetail.available_wallet_points
        }
      } else {
        this.frm.controls["available_wallet_points"].setValue(0);
        this.cardCharges = this.viewData.booked_price
        this.showCardDetail = true
      }
    } else {
      this.payAmount = 'false';
      this.frm.controls["webinarType"].setValue('record');
      this.frm.controls["totalAmount"].setValue(this.viewData.recorded_price);
      this.frm.controls["subTotalAmount"].setValue(this.viewData.recorded_price);
      this.frm.controls["use_points"].setValue(true);
      if (this.fanDetail.available_wallet_points > 0) {
        this.frm.controls["available_wallet_points"].setValue(this.fanDetail.available_wallet_points);
        if (this.viewData.recorded_price < this.fanDetail.available_wallet_points) {
          this.showCardDetail = false
          this.walletCharges = this.viewData.recorded_price
        } else {
          this.cardCharges = Math.abs(this.viewData.recorded_price - this.fanDetail.available_wallet_points)
          this.walletCharges = this.fanDetail.available_wallet_points
        }
      } else {
        this.frm.controls["available_wallet_points"].setValue(0);

        this.cardCharges = this.viewData.recorded_price
        this.showCardDetail = true
      }
    }
  }

  handleDateClick(arg) {
    console.log('date click! ' + arg.dateStr)
  }

  handleEventClick(arg) {
    this.modalRef1 = this.modalService.show(this.viewCalendarPop);
    let apiPath = `booking/get-by-id/${arg.event.id}/${arg.event.extendedProps.requestType}`;
    this.commonService.get(apiPath).subscribe(response => {
      this.viewData = response.data;
      console.log('this.viewData', this.viewData);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
    this.viewData = arg.event;
  }

  /*
  Name: closeModal2
  Description: Close the Booking View popup
  */
  closeModal2() {
    this.modalRef1.hide();
  }

  filterRecords() {
    this.filterStatus = this.filterStatus;
    this.requestType = this.requestType;
    this.getWebinars();
  }

  walletChecked() {
    let wallet = this.frm.get('use_points').value
     if (wallet == false) {
        this.showCardDetail = true
        this.cardCharges = this.frm.value.totalAmount
        if (this.cardCharges == 0) {
          this.showCardDetail = false
        }
        this.walletCharges = 0
      } else {
        if (this.frm.value.totalAmount < this.fanDetail.available_wallet_points) {
          this.showCardDetail = false
          this.walletCharges = this.frm.value.totalAmount
        } else {
          this.cardCharges = Math.abs(this.frm.value.totalAmount- this.fanDetail.available_wallet_points)
          this.walletCharges = this.fanDetail.available_wallet_points
          if (this.cardCharges == 0) {
            this.showCardDetail = false
          }
        }
      }
  }

  newCardClick() {
    this.newCard = true
    this.frm.controls['card'].reset();
  }

  existingCardClick() {
    this.newCard = false
    this.frm.controls['newCard'].reset();
  }

  getUserCardInfo() {
    this.loginUser
    let path = 'user/getStripeCards'
    this.commonService.get(path).subscribe(res => {
      if (res.status == 200) {
        this.cardDetail = res.data
        if (!(this.cardDetail instanceof Array)) {
          this.cardDetail = []
          this.newCard = true
          this.frm.controls["newCard"].setValue('checked')
        }
      } else {
        this.toastr.error(res.message);
      }
    })
  }

  makePayment() {
    let cardId = this.frm.controls['card'].value
    let path = 'user/createPayment'
    let body = {
      totalAmount: this.cardCharges,
      cardId: cardId
    }
    this.commonService.post(path, body).subscribe(res => {
      if (res.status == 200) {
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    })
  }

  makeNewCardPayment(): void {
    let name = ""
    if (this.fanDetail.fname_en) {
      name = this.fanDetail.fname_en
    }

    this.stripeService.createToken(this.card.element, {
      name
    }).subscribe(async (result) => {
      if (result.token) {
        let path = 'user/createPayment'
        let body = {
          totalAmount: this.cardCharges,
          source: result.token.id
        }
        await this.commonService.post(path, body).subscribe(res => {
          if (res.status == 200) {
            this.toastr.success(res.message);
          } else {
            this.toastr.error(res.message);
          }
        })
      } else if (result.error) {
        // Error creating the token
        console.log(result.error.message);
      }
    });
  }
}