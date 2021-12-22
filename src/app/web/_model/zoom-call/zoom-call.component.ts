import {
  Component,
  OnInit,
  Input,
  ViewChild
} from '@angular/core';
import {
  CookieService
} from 'ngx-cookie';
import {
  DataService
} from "../../../services/data.service";
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import {
  NgxSpinnerService
} from 'ngx-spinner';
import {
  ToastrService
} from 'ngx-toastr';
import {
  CommonService
} from 'src/app/services/common.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn
} from '@angular/forms';
import {
  Location
} from '@angular/common';
import {
  NgbActiveModal,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  environment
} from 'src/environments/environment';
import {
  formatDate,
  DatePipe
} from '@angular/common';
import {
  ReviewComponent
} from '../review/review.component';
import {
  zoomOccationData
} from "../../../shared/_json_files/constant"
import {
  TranslateService,
  LangChangeEvent
} from '@ngx-translate/core';
import {
  LoginComponent
} from "../../../../app/auth/login/login.component"
import {
  StripeService,
  StripeCardComponent
} from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js'

@Component({
  selector: 'app-zoom-call',
  templateUrl: './zoom-call.component.html',
  styleUrls: ['./zoom-call.component.scss']
})
export class ZoomCallComponent implements OnInit {
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

  @Input() public dataList;
  frm: FormGroup;
  isSubmited: boolean = false;
  daysSelected: any[] = [];
  event: any;
  calendarDataList: any;
  intrevals: any;
  isConfirm: any;
  isNumber: any;
  isShowForm: any;
  isShowReview: any;
  scheduleList: [];
  minDate: any;
  maxDate: any;
  existTimeSlots: any[] = [];
  date14: any[] = [];
  aryIannaTimeZones: any;
  myFilter: any;
  disableDays: any;
  unDates: any;
  unMonths: any;
  fanDetail: any;
  reviewData: any;
  selectedZone: any;
  zoom_occasion = zoomOccationData;
  selectedLang: any = 'en';
  langs: any = [];
  time = Date.now();

  applyCodeButton = 'false';
  applyCouponDiv = 'false';
  appliedCode = '';
  couponList: any;

  isError: boolean = false;
  isName1: boolean = false;
  isEmail1: boolean = false;
  isName2: boolean = false;
  isEmail2: boolean = false;
  isName3: boolean = false;
  isEmail3: boolean = false;
  isName4: boolean = false;
  isEmail4: boolean = false;
  sameEmail: boolean = false;

  showCardDetail = true
  cardDetail: any
  newCard = false
  cardCharges = 0
  walletCharges = 0
  loginUser: any

  constructor(private _cookieservice: CookieService,
    public ds: DataService,
    public cs: CommonService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    public router: Router,
    private _location: Location,
    private nbModalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private stripeService: StripeService,
    public activeModal: NgbActiveModal, private commonService: CommonService, private translate: TranslateService) {

    this.intrevals = [];
    this.isConfirm = false;
    this.isShowForm = false;
    this.isShowReview = false;

    var minDate = new Date();
    //minDate.setDate(minDate.getDate() + 2); 
    var maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    this.minDate = minDate;
    this.maxDate = maxDate;

    this.disableDays = [];
    this.unDates = [];
    this.unMonths = [];
    this.selectedZone = {
      name: "Asia/Dubai (+00:00)",
      nameValue: "Asia/Dubai",
      timeValue: "+00:00",
      group: "Asia",
      abbr: "GMT"
    };

  }

  ngOnInit(): void {
    let apiPath = `user/get-profile`;
    this.commonService.get(apiPath).subscribe(result => {
      if (result.data.timezone) {
        var timeZoneArr = result.data.timezone.split('/');
        this.selectedZone = {
          name: result.data.timezone + " (+00:00)",
          nameValue: result.data.timezone,
          timeValue: "+00:00",
          group: timeZoneArr[0],
          abbr: "GMT"
        };
      }
      
      this.fanDetail = result.data;
      console.log("this.dataList", this.dataList)
      console.log( "innppp", this.dataList.price,  this.fanDetail.available_wallet_points)
      if (this.fanDetail.available_wallet_points > 0) {
        this.frm.controls["available_wallet_points"].setValue(this.fanDetail.available_wallet_points);
        
        if (this.dataList.price < this.fanDetail.available_wallet_points) {
          this.showCardDetail = false
          this.walletCharges = this.dataList.price
        } else {
          
          this.cardCharges = Math.abs(this.dataList.price - this.fanDetail.available_wallet_points)
          this.walletCharges = this.fanDetail.available_wallet_points
        }
      } else {
      
        this.frm.controls["available_wallet_points"].setValue(0);
        this.frm.controls["use_points"].setValue(false);
        this.cardCharges = this.dataList.price
        this.showCardDetail = true
      }
      console.log("cardCharges", this.cardCharges)
    }, err => {
      this.commonService.handleError(err);
    });

    this.frm = this.fb.group({ // form 
      celebrityId: [this.dataList._id, [Validators.required]],
      zoom_date: [''],
      zoom_time_slot: [''],
      zoomBookingDateTime: [''],
      name: ['test', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      zoom_occasion: ['Please Select Occasion', [Validators.required]],
      zoom_icebreakers: ['', [Validators.required]],
      name_guest1: [''],
      name_guest2: [''],
      name_guest3: [''],
      name_guest4: [''],
      email_guest1: ['', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      email_guest2: ['', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      email_guest3: ['', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      email_guest4: ['', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      terms: ['', [Validators.required]],
      zoom_timezone: [this.dataList.timezone, [Validators.required]],
      totalAmount: [this.dataList.price],
      subTotalAmount: [this.dataList.price, [Validators.required]],
      discountAmount: [0],
      promoCode: [''],
      available_wallet_points: [''],
      use_points: true,
      card: [''],
      newCard: ['']
    });

    if (this.dataList.timezone) {
      var timeZoneArr = this.dataList.timezone.split('/');
      this.selectedZone = {
        name: this.dataList.timezone + " (+00:00)",
        nameValue: this.dataList.timezone,
        timeValue: "+00:00",
        group: timeZoneArr[0],
        abbr: "GMT"
      };
    }

    let path = `celebrities/get-schedule`;
    let options = {
      celebrity_id: this.dataList._id
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.calendarDataList = response.data;
      this.calendarDataList.unavailable_dates.forEach((element) => {
        var unavailableDate = new Date(element);
        let unMonth = unavailableDate.getMonth() + 1;
        this.unMonths.push(unavailableDate.getDate() + '=' + unMonth);
      });

      this.myFilter = (d: Date) => {
        let combineDate = d.getDate() + '=' + (d.getMonth() + 1);
        if (this.unMonths.includes(combineDate)) {
          //disable date
        } else {
          return -1;
        }
      }
    }, err => {
      this.commonService.handleError(err);
    });

    let CFUser = this._cookieservice.get('user-starsin');
    let NewCFUser = JSON.parse(CFUser);
    let userId = NewCFUser._id;
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

    this.getUserCardInfo()
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
    if (this.showCardDetail) {
      if (this.newCard) {
        let payment = this.makeNewCardPayment()
      } else {
        let payment = this.makePayment()
      }
    }
    if (this.frm.value.use_points == true) {
      this.frm.value.wallet_points = this.walletCharges
      this.frm.value.available_wallet_points = Math.abs(this.fanDetail.available_wallet_points - this.walletCharges)
    } else {
      this.frm.value.wallet_points = 0
      this.frm.value.available_wallet_points = Math.abs(this.fanDetail.available_wallet_points - this.walletCharges)
    }
    this.frm.value.card_points = this.cardCharges
    let zoom_guest_details = [];
    zoom_guest_details.push({
      email: this.frm.value.email_guest1,
      name: this.frm.value.name_guest1
    });
    delete this.frm.value.email_guest1;
    delete this.frm.value.name_guest1;

    zoom_guest_details.push({
      email: this.frm.value.email_guest2,
      name: this.frm.value.name_guest2
    });
    delete this.frm.value.email_guest2;
    delete this.frm.value.name_guest2;

    zoom_guest_details.push({
      email: this.frm.value.email_guest3,
      name: this.frm.value.name_guest3
    });
    delete this.frm.value.email_guest3;
    delete this.frm.value.name_guest3;

    zoom_guest_details.push({
      email: this.frm.value.email_guest4,
      name: this.frm.value.name_guest4
    });
    delete this.frm.value.email_guest4;
    delete this.frm.value.name_guest4;

    this.frm.value.zoom_guest_details = zoom_guest_details;
    this.frm.value.requestType = 4; //Zoom connect

    delete this.frm.value.terms;

    this.frm.value.zoom_timezone = this.frm.value.zoom_timezone.nameValue;

   
    delete this.frm.value.use_points;
    //delete this.frm.value.available_wallet_points;
    delete this.frm.value.card
    delete this.frm.value.newCard

    let path = 'booking/addBooking';
    this.cs.post(path, this.frm.value).subscribe(res => {
        if (res.status == 200) {
          this.spinner.hide()
          this.activeModal.close();
          this.toastr.success(res.message);
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
        this.cs.loading(false)
        this.cs.handleError(err);
      }
    );
  }

  /*
  Name: showConfirmButtom
  Description: To show the confirm button on form
  */
  showConfirmButtom(item, i) {
    this.isNumber = i;
    this.isConfirm = true;
  }


  /*
  Name: showForm
  Description: Show form after select the date and time
  */
  showForm(item) {
    this.frm.controls["zoom_time_slot"].setValue(item);
    let zoom = this.frm.value.zoom_date;
    let pipe = new DatePipe('en-US');
    var myShortFormat = pipe.transform(zoom, 'fullDate');
    var timeArr = item.split(' ');

    let zoom2 = this.frm.value.zoom_date;
    let date = pipe.transform(zoom2, 'yyyy-MM-dd')
    var zoomDateTime = date + 'T' + timeArr[0] + ':00+04:00'; ////2021-01-14T09:05:30+04:00

    this.reviewData = this.frm.value;
    this.frm.controls["zoomBookingDateTime"].setValue(zoomDateTime);
    let path = `booking/check-time-slots`;
    let options = {
      userId: this.dataList._id,
      zoomBookingDateTime: zoomDateTime
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      if (response.data == false) {
        this.toastr.error(response.message);
      } else {
        this.isShowForm = true;
        this.isShowReview = false;
        this.frm.controls["name"].setValue(this.fanDetail.fname_en + ' ' + this.fanDetail.lname_en);
        this.frm.controls["email"].setValue(this.fanDetail.email);
      }

    }, err => {
      this.commonService.handleError(err);
    });
  }

  /*
  Name: showReview
  Description: Show Review form after fill all info
  */
  showReview() {
    if (this.frm.invalid) {
      this.spinner.hide()
      this.isSubmited = true;
      return;
    }
    this.customValidations();
    console.log(this.isError);
    if (this.isError == true) {
      return;
    }
    this.isShowForm = false;
    this.isShowReview = true;
    this.reviewData = this.frm.value;
    console.log('this.reviewData', this.reviewData)
  }

  /*
  Name: back
  Description: Back from Review
  */
  back() {
    this.isShowForm = true;
    this.isShowReview = false;
  }


  /*
  Name: dateChanged
  Description: When date changed from calendar
  */
  dateChanged(date) {
    this.spinner.show();
    this.frm.controls["zoom_date"].setValue(date);
    this.getIntervals(date, this.frm.value.zoom_timezone.nameValue);
    this.spinner.hide();
  }

  getCurrentTime(event: any) {
    if (this.frm.value.zoom_timezone.nameValue) {
      var timeZoneValue = this.frm.value.zoom_timezone.nameValue;
    } else {
      var timeZoneValue = this.fanDetail.timezone;
    }
    this.getIntervals(this.frm.value.zoom_date, timeZoneValue);
  }

  /*
  Name: getIntervals
  Description: Find intervals from start time and end time
  */
  getIntervals(date, timezone) {
    this.spinner.show();
    if (date != '') {
      let path = 'booking/get-time-slots';
      let options = {
        celebrityId: this.dataList._id,
        zoom_date: date,
        requestType: 4
      };
      this.commonService.queryParams(path, options).subscribe(response => {
        this.existTimeSlots = response.data;
        var weekday = [];
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        let selectedDay = weekday[new Date(date).getDay()];

        let day = ("0" + date.getDate()).slice(-2); // adjust 0 before single digit date    
        let month = ("0" + (date.getMonth() + 1)).slice(-2); // current month    
        let year = date.getFullYear(); // current year   
        let selectedDate = year + "-" + month + "-" + day; // prints date in YYYY-MM-DD format        

        this.intrevals = [];
        if (!this.calendarDataList.unavailable_dates.includes(selectedDate)) {
          this.calendarDataList.data.forEach((element) => {
            if (element.day == selectedDay) {
              if (timezone == this.dataList.timezone) { //on load or same timezone with star
                for (var d = new Date(element.morning_start_time); d <= new Date(element.morning_end_time); d.setMinutes(d.getMinutes() + this.calendarDataList.interval)) {
                  let refineTime = formatDate(new Date(d), 'hh:mm a', 'en-US', '+0530');
                  if (!this.existTimeSlots.includes(refineTime)) {
                    this.intrevals.push(refineTime);
                  }
                }
                for (var d = new Date(element.afternoon_start_time); d <= new Date(element.afternoon_end_time); d.setMinutes(d.getMinutes() + this.calendarDataList.interval)) {
                  let refineTime = formatDate(new Date(d), 'hh:mm a', 'en-US', '+0530');
                  if (!this.existTimeSlots.includes(refineTime)) {
                    this.intrevals.push(refineTime);
                  }
                }
                for (var d = new Date(element.evening_start_time); d <= new Date(element.evening_end_time); d.setMinutes(d.getMinutes() + this.calendarDataList.interval)) {
                  let refineTime = formatDate(new Date(d), 'hh:mm a', 'en-US', '+0530');
                  if (!this.existTimeSlots.includes(refineTime)) {
                    this.intrevals.push(refineTime);
                  }
                }
              } else { //if fan chooses different timezone

                /* Morning intervals */
                let morningDate = new Date(element.morning_start_time);
                let newMorningStartTime = morningDate.toLocaleString("en-US", {
                  timeZone: `${timezone}`
                });

                let morningEndDate = new Date(element.morning_end_time);
                let newMorningEndTime = morningEndDate.toLocaleString("en-US", {
                  timeZone: `${timezone}`
                });
                for (var d = new Date(newMorningStartTime); d <= new Date(newMorningEndTime); d.setMinutes(d.getMinutes() + this.calendarDataList.interval)) {
                  let refineTime = formatDate(new Date(d), 'hh:mm a', 'en-US', '+0530');
                  if (!this.existTimeSlots.includes(refineTime)) {
                    this.intrevals.push(refineTime);
                  }
                }

                /* Afternoon intervals */
                let afternoonDate = new Date(element.afternoon_start_time);
                let newAfternoonStartTime = afternoonDate.toLocaleString("en-US", {
                  timeZone: `${timezone}`
                });

                let afternoonEndDate = new Date(element.afternoon_end_time);
                let newAfternoonEndTime = afternoonEndDate.toLocaleString("en-US", {
                  timeZone: `${timezone}`
                });
                for (var d = new Date(newAfternoonStartTime); d <= new Date(newAfternoonEndTime); d.setMinutes(d.getMinutes() + this.calendarDataList.interval)) {
                  let refineTime = formatDate(new Date(d), 'hh:mm a', 'en-US', '+0530');
                  if (!this.existTimeSlots.includes(refineTime)) {
                    this.intrevals.push(refineTime);
                  }
                }

                /* Evening intervals */
                let eveningDate = new Date(element.evening_start_time);
                let newEveningStartTime = eveningDate.toLocaleString("en-US", {
                  timeZone: `${timezone}`
                });

                let eveningEndDate = new Date(element.evening_end_time);
                let newEveningEndTime = eveningEndDate.toLocaleString("en-US", {
                  timeZone: `${timezone}`
                });
                for (var d = new Date(newEveningStartTime); d <= new Date(newEveningEndTime); d.setMinutes(d.getMinutes() + this.calendarDataList.interval)) {
                  let refineTime = formatDate(new Date(d), 'hh:mm a', 'en-US', '+0530');
                  if (!this.existTimeSlots.includes(refineTime)) {
                    this.intrevals.push(refineTime);
                  }
                }

              }
            }
          });
        }
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      });
    }
  }

  isSelected = (event: any) => {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    return this.daysSelected.find(x => x == date) ? "selected" : null;
  };

  /*
  Name: select
  Description: when choose the date from calendar
  */
  select(event: any, calendar: any) {
    this.spinner.show();
    if (this.frm.value.zoom_timezone.nameValue) {
      var timeZoneValue = this.frm.value.zoom_timezone.nameValue;
    } else {
      var timeZoneValue = this.frm.value.zoom_timezone.name;
    }
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    const index = this.daysSelected.findIndex(x => x == date);

    this.daysSelected = [];
    if (index < 0) this.daysSelected.push(date);
    else this.daysSelected.splice(index, 1);
    calendar.updateTodaysDate();
    this.frm.controls["zoom_date"].setValue(event);
    this.getIntervals(event, timeZoneValue);
    this.spinner.hide();
  }

  /*
  Name: customValidations
  Description: Custom validations for Guest Names and Emails 
  */
  customValidations() {
    this.isError = true;
    this.sameEmail = false;
    const allEmails = []

    //Name and Email 1
    const name_guest1 = this.frm.controls['name_guest1'].value;
    const email_guest1 = this.frm.controls['email_guest1'].value;
    if (name_guest1 == '' && email_guest1 != '') {
      this.isName1 = true;
      return;
    }
    if (name_guest1 != '' && email_guest1 == '') {
      this.isEmail1 = true;
      return;
    }
    if ((name_guest1 == '' && email_guest1 == '') || (name_guest1 != '' && email_guest1 != '')) {
      this.isName1 = false;
      this.isEmail1 = false;
      this.isError = false;
    }
    allEmails.push(email_guest1);

    //Name and Email 2
    const name_guest2 = this.frm.controls['name_guest2'].value;
    const email_guest2 = this.frm.controls['email_guest2'].value;
    if (name_guest2 == '' && email_guest2 != '') {
      this.isName2 = true;
      return;
    }
    if (name_guest2 != '' && email_guest2 == '') {
      this.isEmail2 = true;
      return;
    }
    if ((name_guest2 == '' && email_guest2 == '') || (name_guest2 != '' && email_guest2 != '')) {
      this.isName2 = false;
      this.isEmail2 = false;
      this.isError = false;
    }
    allEmails.push(email_guest2);

    //Name and Email 3
    const name_guest3 = this.frm.controls['name_guest3'].value;
    const email_guest3 = this.frm.controls['email_guest3'].value;
    if (name_guest3 == '' && email_guest3 != '') {
      this.isName3 = true;
      return;
    }
    if (name_guest3 != '' && email_guest3 == '') {
      this.isEmail3 = true;
      return;
    }
    if ((name_guest3 == '' && email_guest3 == '') || (name_guest3 != '' && email_guest3 != '')) {
      this.isName3 = false;
      this.isEmail3 = false;
      this.isError = false;
    }
    allEmails.push(email_guest3);

    //Name and Email 4
    const name_guest4 = this.frm.controls['name_guest4'].value;
    const email_guest4 = this.frm.controls['email_guest4'].value;
    if (name_guest4 == '' && email_guest4 != '') {
      this.isName4 = true;
      return;
    }
    if (name_guest4 != '' && email_guest4 == '') {
      this.isEmail4 = true;
      return;
    }
    if ((name_guest4 == '' && email_guest4 == '') || (name_guest4 != '' && email_guest4 != '')) {
      this.isName4 = false;
      this.isEmail4 = false;
      this.isError = false;
    }
    allEmails.push(email_guest4);

    //Check Same emails

    // if( (email_guest1 == email_guest2) || (email_guest1 == email_guest3) || (email_guest1 == email_guest4) ){
    //   this.sameEmail1 = true;
    // }

    console.log('allEmails', allEmails);
    //console.log(allEmails.includes(email_guest1));

    var counts = {};

    allEmails.forEach(function (element) {
      counts[element] = (counts[element] || 0) + 1;
    });

    console.log('counts', counts);
    for (var element in counts) {
      console.log(element + ' = ' + counts[element]);
      if (counts[element] > 1) {
        this.sameEmail = true;
      }
    }

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
          if (this.dataList.price < this.fanDetail.available_wallet_points) {
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
      if (this.dataList.price < this.fanDetail.available_wallet_points) {
        this.showCardDetail = false
        this.walletCharges = this.dataList.price
      } else {
        this.cardCharges = Math.abs(this.dataList.price - this.fanDetail.available_wallet_points)
        this.walletCharges = this.fanDetail.available_wallet_points
      }
    } else {
      this.frm.controls["available_wallet_points"].setValue(0);
      this.frm.controls["use_points"].setValue(false);
      this.cardCharges = this.dataList.price
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

  // testing purpose getting error of multple window opening

  // bookZoom() {
  //   this.spinner.show();
  //   let CFUser = this._cookieservice.get('user-starsin');
  //   if (!CFUser) {
  //     this._cookieservice.put('service', 'zoomcall');
  //     const modalRef = this.modalService.open(LoginComponent, {
  //       backdrop: 'static',
  //       keyboard: false,
  //       windowClass: "modal-holder",
  //     });
  //     modalRef.componentInstance.title = "Login";
  //     this.spinner.hide();
  //   } else {
  //     let apiPath = `booking/get-meeting-count`;
  //     this.commonService.get(apiPath).subscribe(result => {
  //       this.spinner.hide();
  //       if (result.data.available == true) {
  //         var obj = {
  //           _id: this.dataList._id,
  //           image: this.dataList.image,
  //           name: this.dataList.fname_en,
  //           timezone: this.dataList.timezone,
  //           price: this.dataList.connect_on_zoom_price
  //         }
  //         const modalRef = this.nbModalService.open(ZoomCallComponent, {
  //           windowClass: "modal-holder zoom_modal",
  //           backdrop: 'static',
  //           keyboard: false,
  //         });
  //         modalRef.componentInstance.dataList = obj;
  //       } else {
  //         this.toastr.error('Sorry! No user availablity.');
  //       }
  //     }, err => {
  //       this.commonService.handleError(err);
  //     });
  //   }
  // }

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
        this.cardCharges = Math.abs(this.frm.value.totalAmount - this.fanDetail.available_wallet_points)
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