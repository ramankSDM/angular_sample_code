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
  NgbActiveModal,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  ReviewComponent
} from '../review/review.component';
import {
  dm_text
} from "../../../shared/_json_files/constant"
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
  selector: 'app-dm',
  templateUrl: './dm.component.html',
  styleUrls: ['./dm.component.scss']
})
export class DmComponent implements OnInit {
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
  fanDetail: any;
  applyCodeButton = 'false';
  applyCouponDiv = 'false';
  appliedCode = '';
  couponList: any;
  dmData = dm_text[0].placeholdermsg
  selectedLang: any = 'en';
  langs: any = [];

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
    public router: Router,
    private nbModalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private stripeService: StripeService,
    public activeModal: NgbActiveModal, private commonService: CommonService, private translate: TranslateService) {
    this.fanDetail = [];

  }

  ngOnInit(): void {
    this.frm = this.fb.group({ // form 
      celebrityId: [this.dataList._id, [Validators.required]],
      dm_text: ['', [Validators.required]],
      isPublic: ['true'], //Private    
      totalAmount: [this.dataList.price],
      subTotalAmount: [this.dataList.price, [Validators.required]],
      discountAmount: [0],
      promoCode: [''],
      available_wallet_points: [''],
      terms: ['', [Validators.required]],
      use_points: true,
      card: [''],
      newCard: [''],
    });

    let apiPath = `user/get-profile`;
    this.commonService.get(apiPath).subscribe(result => {
       this.fanDetail = result.data;
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
    this.add()
  }

  /*
  Name: add
  Description: Save the request into database
  */
  add() {
    this.spinner.show();
    if (this.frm.value.use_points == true) {
      this.frm.value.wallet_points = this.walletCharges
      this.frm.value.available_wallet_points = Math.abs(this.fanDetail.available_wallet_points - this.walletCharges)
    } else {
      this.frm.value.wallet_points = 0
      this.frm.value.available_wallet_points = Math.abs(this.fanDetail.available_wallet_points - this.walletCharges)
    }
    this.frm.value.card_points = this.cardCharges
    delete this.frm.value.use_points;
    //delete this.frm.value.available_wallet_points;
    delete this.frm.value.toNewName;
    delete this.frm.value.wallet
    delete this.frm.value.card
    delete this.frm.value.newCard
    delete this.frm.value.terms

    if (this.showCardDetail) {
      if (this.newCard) {
        let payment = this.makeNewCardPayment()
      } else {
        let payment = this.makePayment()
      }
    }
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
      if(this.frm.value.totalAmount < this.fanDetail.available_wallet_points){
         this.showCardDetail = false
         this.walletCharges = this.frm.value.totalAmount
      }else{
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