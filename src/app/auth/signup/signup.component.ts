import { Component, OnInit, ViewChildren, ElementRef, Input } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from './../../shared/services/common.service';
import { SocialAuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { DataService } from './../../services/data.service';
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'

import { LoginComponent } from '../login/login.component'
import { MustMatch } from './../../shared/must-match-validator';
import { ToastrService } from 'ngx-toastr';
import { countrycodes } from "../../shared/_json_files/countryCode";
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { SignupCelebrityComponent } from '../signup-celebrity/signup-celebrity.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', "./../otp-verification/otp-verification.component.scss"],
  animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
  selectedLang: any = 'en';
  isTextFieldType: boolean = true
  ispasswordFieldType : boolean = true
   @Input() public dataList;
  langs: any = [];
  title = 'otp';
  formInput = ['input1', 'input2', 'input3', 'input4'];
  @ViewChildren('formRow') rows: any;
  signUpForm: FormGroup;
  roleForm: FormGroup;
  isSignSubmited: boolean = false;
  checked = false;
  msg: string = ""
  otpForm: FormGroup;
  otpmsg: string = ""
  showOTPForm: boolean = false;
  enteredPhone: string;
  timeLeft: number;
  interval;
  userId: any = ''
  address_details = {};
  userData: any;
  fan: any;
  roleId: any = '';
  countryCodeList = countrycodes
  minDate: Date;
  maxDate: Date;
  constructor(
    public ds: DataService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public router: Router,
    private authService: SocialAuthService,
    public cs: CommonService,
    private _cookieservice: CookieService,
    private translate: TranslateService,
    private modalService: NgbModal,
  ) {
    this.otpForm = this.toFormGroup(this.formInput);
    this.minDate = new Date();
    var pastYear = this.minDate.getFullYear() - 100;
    this.minDate.setFullYear(pastYear);
    this.maxDate = new Date();
    var pastMaxYear = this.maxDate.getFullYear() - 18;
    this.maxDate.setFullYear(pastMaxYear);
  }

  toFormGroup(elements) {
    const group: any = {};
    elements.forEach(key => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  startTimer() {
    this.timeLeft = 90;
    setTimeout(() => {
      if (this.rows && this.rows._results && this.rows._results.length) {
        this.rows._results[0].nativeElement.focus();
      }
    }, 1000)

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
    }, 1000)
  }

  keyUpEvent(event, index) {
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < this.formInput.length) {
      this.rows._results[pos].nativeElement.focus();
    }
    let otp = "";
    for (var k in this.otpForm.value) {
      otp += this.otpForm.value[k]
    }
    if (otp.length == 4) {
      this.verifyOtp()
    }
  }

  ngOnInit() {
    let passwordPattern = '^(?:(?:(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]))|(?:(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?~_+-=|\]))|(?:(?=.*[0-9])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?~_+-=|\]))|(?:(?=.*[0-9])(?=.*[a-z])(?=.*[*.!@$%^&(){}[]:;<>,.?~_+-=|\]))).{8,32}$'
    this.signUpForm = this.fb.group({   // Signup form
      fname_en: ['', [Validators.required, Validators.maxLength(20)]],
      lname_en: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(15),Validators.pattern(passwordPattern)]],
      // password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      std_code: [this.countryCodeList[0].isdcode, [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      dob: [this.maxDate, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      role: [2, []]
    },
    {
      validator: MustMatch('password', 'confirmPassword')
  });

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
  }

  setLang(lang) {
    this.selectedLang = lang
    this.translate.use(lang);
    localStorage.currentLang = lang;
    this.ds.set(lang, "currentLang");
  }

  get f() { return this.signUpForm.controls; }


  /** Customer signup to database*/
  signUp() {
    //console.log('this.signUpForm', this.signUpForm.value)
    if (this.signUpForm.invalid) {
      this.isSignSubmited = true;
      return;
    }

    var dateobj = new Date();
    this.signUpForm.value['dob'] = dateobj.toISOString();
    if(this.dataList && this.dataList.userReferralCode){
      this.signUpForm.value['userReferralCode'] = this.dataList.userReferralCode
    }

    this.cs.post('user/register', this.signUpForm.value, delete this.signUpForm.value.confirmPassword).subscribe(user => {
      if (user.status == 200) {
       // this.activeModal.dismiss('Cross click');
        this.signUpForm.reset();
       // this.showOTPForm = true

        let jsonToCookie = user.data
        this._cookieservice.put('user-starsin', JSON.stringify(jsonToCookie));
        this.activeModal.close()
        this.router.navigate(["fans/profile"]);
        this.ds.setProfile.emit(jsonToCookie)
        this.toastr.success(user.message, 'Success')
      } else {
        this.toastr.error(user.message, 'Error')
      }

    }, error => {
      this.toastr.error(error.error.message, 'Error')
      // this.msg = error;
      // this.cs.showAlert('error', error);
    });
  }

  /** Customer signup or login by Google or Facebook*/
  initiateSocialLogin(loginType) {
    let provider_id = '';
    if (loginType === 'google') {
      provider_id = GoogleLoginProvider.PROVIDER_ID;
    } else {
      provider_id = FacebookLoginProvider.PROVIDER_ID;
    }
    this.authService.signIn(provider_id).then(user => {
      let reqObj = {
        role: 3,
        name: user.name,
        fname_en: user.firstName,
        lname_en: user.lastName,
        email: user.email,
        image: user.photoUrl,
        socialToken: user.authToken,
        loginType: loginType,
      }
      this.userRegister(reqObj).then((res: any) => {
        this.cs.showAlert('success', 'Logged in successfully');
        this.applyLogin(res.data);
      }).catch(err => {
        this.msg = err;
        // this.cs.showAlert('error', err);
      });
    })
  }

  /* Check user by email */
  userRegister(data) {
    return new Promise((resolve, reject) => {
      this.cs.post('user/social-login', data).subscribe(res => {
        resolve(res);
      }, error => {
        reject(error)
      });
    })
  }

  applyLogin(data) {
    // this.cs.showAlert('success', data.message);
    localStorage.setItem('user-starsin', JSON.stringify(data));
    this._cookieservice.put('user-starsin', JSON.stringify(data));

    this.ds.set('loggedIn', 'isLoggedInUser');
    console.log(data);

    if (data.role == 1) {
      this.router.navigate(['profile']);
      this.activeModal.dismiss('Cross click');
    }
    else if (data.role == 3) {
      this.router.navigate(['fans/profile']);
      this.router.navigate(["fans/share-profile"]);
      this.activeModal.dismiss('Cross click');
    }
    else if (data.role == 2) {
      // console.log("in apply login ...")
      this.router.navigate(['celebrity/profile']);
      this.activeModal.dismiss('Cross click');
    }
  }

  /* Open login model */
  login() {
    this.activeModal.dismiss();
    const modalRef = this.modalService.open(LoginComponent, { windowClass: 'modal-holder' });
    modalRef.componentInstance.title = 'Login';
  }

  verifyOtp() {
    this.otpmsg = ""
    if (this.timeLeft != 0) {
      this.isSignSubmited = true;
      if (this.otpForm.invalid) {
        return;
      }
      let otp = "";
      for (var k in this.otpForm.value) {
        otp += this.otpForm.value[k]
      }
      var obj = {
        userId: this.userId,
        otp: otp
      }
      this.cs.post("user/verify-otp", obj).subscribe(
        data => {
          this.isSignSubmited = false
          if (data.data) {
            this.applyLogin(this.userData);
            // clearInterval(this.interval);
            this.cs.showAlert('success', 'Signed up successfully.');
            //  this.activeModal.dismiss('Cross click');
          } else {
            this.otpmsg = data.message;
          }
        }
      );
    }
    else {
      this.otpmsg = "OTP expired. Send code again."
    }
  }

  resendOTP() {
    this.cs.post("user/resend-otp", { _id: this.userId, name: this.userData.name, phoneNumber: this.enteredPhone }).subscribe(
      res => {
        console.log(res)
        if (res.data) {
          this.otpmsg = ""
          this.startTimer();
          this.cs.showAlert("success", "Otp sent.");
        }
        else {
          this.cs.showAlert("error", "Error in sending OTP. Please try again.");
        }
      },
      error => {
        this.otpmsg = error.message
      }
    );
  }
  
  togglePasswordFieldType() {
    this.isTextFieldType = !this.isTextFieldType;
  }

  togglePasswordConfirmFieldType(){
    this.ispasswordFieldType = !this.ispasswordFieldType
  }

  signupAsCel() {
    this.activeModal.dismiss();
    const modalRef = this.modalService.open(SignupCelebrityComponent, {
      windowClass: "modal-holder",
    });
    modalRef.componentInstance.title = "Signup";
  }

 

}
