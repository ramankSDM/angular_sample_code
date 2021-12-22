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
  Validators
} from '@angular/forms';
import {
  Location
} from '@angular/common';
import {
  NgbActiveModal,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap'
import {
  TranslateService,
  LangChangeEvent
} from '@ngx-translate/core';
import {
  environment
} from 'src/environments/environment';
import {
  ReviewComponent
} from '../review/review.component';
import {
  media
} from "../../../shared/_json_files/constant"
import {
  i_got_talent,
  instructuionMsg
} from "../../../shared/_json_files/constant"
import {
  StripeService,
  StripeCardComponent
} from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js'

@Component({
  selector: 'app-iot',
  templateUrl: './iot.component.html',
  styleUrls: ['./iot.component.scss']
})
export class IotComponent implements OnInit {
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
  selectedLang: any = 'en';

  langs: any = [];
  couponList: any;
  values1: string[];
  applyCodeButton = 'false';
  applyCouponDiv = 'false';
  appliedCode = '';
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  introVideo: any;
  iotType = 'video';
  language: string = '';
  minDate: Date;
  maxDate: Date;
  fanDetail: any;

  isShowForm: any;
  isShowReview: any;
  reviewData: any;
  videoFile = media.video
  imageFile = media.image
  igtData = i_got_talent;
  extensionMsg = instructuionMsg.msgextention
  instructionMsg = instructuionMsg.igtmsg

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
    private _location: Location,
    private nbModalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private stripeService: StripeService,
    public activeModal: NgbActiveModal, private commonService: CommonService, private translate: TranslateService) {
    this.minDate = new Date();
    this.isShowForm = true;
    this.isShowReview = false;
  }

  ngOnInit(): void {
    this.loginUser = this._cookieservice.get("user-starsin");
    if (this.loginUser) {
      this.loginUser = JSON.parse(this.loginUser);
    }
    let CFUser = this._cookieservice.get('user-starsin');
    let NewCFUser = JSON.parse(CFUser);
    let userId = NewCFUser._id;

    let path = `promoCode/get-all-promoShareCode`;
    let options = {
      id: userId,
      page: this.activePage,
      count: this.rowsOnPage
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.couponList = response.data.data;
    }, err => {
      this.commonService.handleError(err);
    });

    let apiPath = `user/get-profile`;
    this.commonService.get(apiPath).subscribe(result => {
      this.fanDetail = result.data;
      if (this.fanDetail.available_wallet_points > 0) {
        this.frm.controls["available_wallet_points"].setValue(this.fanDetail.available_wallet_points);
        if (this.dataList.totalAmount < this.fanDetail.available_wallet_points) {
          this.showCardDetail = false
          this.walletCharges = this.dataList.totalAmount
        } else {
          this.cardCharges = Math.abs(this.dataList.totalAmount - this.fanDetail.available_wallet_points)
          this.walletCharges = this.fanDetail.available_wallet_points
        }
      } else {
        this.frm.controls["available_wallet_points"].setValue(0);
        this.frm.controls["use_points"].setValue(false);
        this.cardCharges = this.dataList.totalAmount
        this.showCardDetail = true
      }
    }, err => {
      this.commonService.handleError(err);
    });


    this.frm = this.fb.group({ // Signup form
      celebrityId: [this.dataList._id, [Validators.required]],
      instruction: ['', [Validators.required]],
      promoCode: [''],
      totalAmount: [this.dataList.totalAmount, [Validators.required]],
      subTotalAmount: [this.dataList.totalAmount, [Validators.required]],
      discountAmount: [0],
      adminFee: [0],
      serviceFee: [0],
      toName: [''],
      fromName: [''],
      occasion: [''],
      relationShip: [''],
      talentCategory: ['', [Validators.required]],
      talentVideo: ['', []],
      talentMp3: ['', []],
      talentImages: [
        [],
        []
      ],
      talentType: ['video', []], // video , mp3,img
      language: [this.language, [Validators.required]],
      email: [this.loginUser.email, [Validators.required, Validators.email]],
      isPublic: [true, [Validators.required]], //private
      sendToFriend: [false, [Validators.required]],
      requestType: [2, [Validators.required]],
      videoFor: ['me', [Validators.required]],
      // cardName: ['Ranjeet Saini', [Validators.required]],
      // cardNumber: ['4242424242424242', [Validators.required]],
      // expiry: ['01/30', [Validators.required]],
      // cvv: ['111', [Validators.required]],
      stayUpdated: [false, [Validators.required]],
      occasionDate: [this.minDate, [Validators.required]],
      isExtended: [false, [Validators.required]],
      available_wallet_points: [''],
      use_points: true,
      card: [''],
      newCard: [''],
    });

    if (this.dataList.lang == 'en') {
      this.language = 'en';
      this.frm.controls["language"].setValue("en");
    } else if (this.dataList.lang == 'ar') {
      this.language = 'ar';
      this.frm.controls["language"].setValue("ar");
    } else {
      this.language = '';
      this.frm.controls["language"].setValue("ar");
    }

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
  Name: onUpload
  Description: Upload images on s3
  */
  onUpload(event) {
    this.spinner.show();

    if (event && event.target && event.target.files && event.target.files.length > 0) {
      let profileImage = event.target.files;

      if (profileImage.length > 5) {
        this.spinner.hide();
        this.toastr.error("Maximum 5 images can be upload");
        return false;
      }
      let profileImageName = []
      for (var i = 0; i < profileImage.length; i++) {

        let file = profileImage[i];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
            const imgBase64Path = e.target.result;
            let apiPath = `common/s3imgUpload`;
            this.commonService.post(apiPath, {
              "image": imgBase64Path
            }).subscribe(result => {
              if (this.iotType == 'img') {
                profileImageName.push(result.data.location);
                this.frm.patchValue({
                  talentImages: profileImageName
                });
              }
            }, err => {
              this.spinner.hide();
              this.commonService.handleError(err);
            });
          }
        }
      }
      this.spinner.hide();
    }
  }


  //   onUpload(event) {
  //     const allowedImageMimeTypes = [
  //       "image/jpeg",
  //       "image/png",
  //       "image/gif",
  //       "image/bmp",
  //       "image/jpg"
  //     ];
  //     if (event && event.target && event.target.files && event.target.files.length > 0) {
  //       let profileImage = event.target.files;
  //       for (var i = 0; i < profileImage.length; i++) {
  //         if (allowedImageMimeTypes.indexOf(profileImage[i].type) == -1) {
  //           this.toastr.error("Please upload an image with one of the following extensions : '.jpeg','.jpg','.gif','.png','.png','.bmp'");
  //           return false;
  //         }
  //         if (profileImage[i].size > this.imageFile) {
  //           this.toastr.error("Too large image, Please upload profile image of size 25mb or less.");
  //           return false;
  //         }
  //       }

  //       this.spinner.show();
  //       const formData: FormData = new FormData();
  //       for (var i = 0; i < profileImage.length; i++) {
  //         formData.append('images', profileImage[i]);
  //       }
  //       formData.append('imgLocation', 'bookings');
  //       let apiPath = `common/imgMultipleUpload`;
  //       this.commonService.post(apiPath, formData).subscribe(result => {
  //         let profileImageName = []
  //         if (this.iotType == 'img') {
  //           for (var i = 0; i < result.data.length; i++) {
  //             profileImageName.push(environment.backendURL + 'images/bookings/' + result.data[i]);
  //           }
  //           console.log("talentImages", profileImageName)
  //           this.frm.patchValue({
  //             talentImages: profileImageName
  //           });
  //         }
  //         console.log("this.frm", this.frm.value)
  //         this.spinner.hide();
  //       }, err => {
  //         this.spinner.hide();
  //         this.commonService.handleError(err);
  //       });
  //   }
  // }

  /*
  Name: onVideoUpload
  Description: Upload video and audio
  */
  onVideoUpload(event) {
    this.introVideo = "";
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size > this.videoFile) {
        this.toastr.error("Too large image, Please upload profile image of size 25mb or less.");
        return false;
      } else {
        const video = event.target.files[0];
        let type;
        let apiPath;
        if (this.iotType == 'mp3') {
          type = 'audio';
          apiPath = `common/audioUpload`;
        } else {
          type = 'video';
          apiPath = `common/videoUpload`;
        }
        const formData: FormData = new FormData();
        formData.append('video', video);
        formData.append('type', type);
        this.spinner.show();
        this.cs.post(apiPath, formData).subscribe(result => {
          const location = result.data;
          var obj = {
            intro_video: location,
            isUpdateImageVideo: 1,
            type: 'video'
          }

          if (this.iotType == 'mp3') {
            this.frm.patchValue({
              talentMp3: location
            });
          } else {
            this.frm.patchValue({
              talentVideo: location
            })
          }
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.cs.handleError(err);
        });

      }
    }
  }

  /*
  Name: changeIotType
  Description: Change Iot type
  */
  changeIotType(type) {
    if (type == 'mp3') {
      this.iotType = 'mp3';
      this.frm.controls["talentType"].setValue('mp3', {
        onlySelf: true
      });
    } else if (type == 'img') {
      this.iotType = 'img';
      this.frm.controls["talentType"].setValue('img', {
        onlySelf: true
      });
    } else {
      this.iotType = 'video';
      this.frm.controls["talentType"].setValue('video', {
        onlySelf: true
      });
    }
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
    this.isShowForm = false;
    this.isShowReview = true;
    this.reviewData = this.frm.value;
    // console.log('this.reviewData',this.reviewData)
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
  Name: save
  Description: Submit the iot request
  */
  save() {
    this.spinner.show()
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
    if (this.frm.value.use_points == true) {
      this.frm.value.wallet_points = this.walletCharges 
      this.frm.value.available_wallet_points = Math.abs(this.fanDetail.available_wallet_points - this.walletCharges)
    }else{
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

    if(this.showCardDetail){
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
          this._cookieservice.put('service', '');
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
          // this._location.back();
        } else {
          this.spinner.hide()
          this.toastr.error(res.message);
        }
      },
      (err) => {
        this.spinner.hide()
        this.cs.loading(false)
        this.cs.handleError(err);
        // this.router.navigate(['/admin/fans'])
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
        this.dataList.totalAmount = response.data.total_amount

        if (this.fanDetail.available_wallet_points > 0) {
          if (this.dataList.totalAmount < this.fanDetail.available_wallet_points) {
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
      if (this.dataList.totalAmount < this.fanDetail.available_wallet_points) {
        this.showCardDetail = false
        this.walletCharges = this.dataList.totalAmount
      } else {
        this.cardCharges = Math.abs(this.dataList.totalAmount - this.fanDetail.available_wallet_points)
        this.walletCharges = this.fanDetail.available_wallet_points
      }
    } else {
      this.frm.controls["available_wallet_points"].setValue(0);
      this.frm.controls["use_points"].setValue(false);
      this.cardCharges = this.dataList.totalAmount
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

  walletChecked() {
    let wallet = this.frm.get('use_points').value
    if (wallet == false) {
      this.showCardDetail = true
      this.cardCharges = this.dataList.totalAmount 
      if (this.cardCharges == 0) {
        this.showCardDetail = false
      }
      this.walletCharges = 0
    } else {
      if(this.dataList.totalAmount < this.fanDetail.available_wallet_points){
         this.showCardDetail = false
         this.walletCharges = this.dataList.totalAmount
      }else{
        this.cardCharges = Math.abs(this.dataList.totalAmount - this.fanDetail.available_wallet_points)
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