import { Component, OnInit, Input, ViewChildren, ElementRef } from "@angular/core";
import { routerTransition } from "../../router.animations";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { CommonService } from "./../../shared/services/common.service";
import { Route, ActivatedRoute, Params, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { ChatService } from "../../shared/services/chat.service";
import { DataService } from "./../../services/data.service";
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SignupComponent } from "./../../auth/signup/signup.component";
import { SignupCelebrityComponent } from "./../../auth/signup-celebrity/signup-celebrity.component";
import { ForgotPasswordComponent } from "./../../auth/forgot-password/forgot-password.component";
import * as io from "socket.io-client";
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { ShoutoutComponent } from "../../web/_model/shoutout/shoutout.component"
import { EncryptionService } from './../../services/encryption.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss", "./../otp-verification/otp-verification.component.scss"],
  animations: [routerTransition()],
  providers: [NgbModal]
})
export class LoginComponent implements OnInit {
  selectedLang: any = 'en';
  langs: any = [];
  buttonText: string = "email";
  title = 'otp';
  formInput = ['input1', 'input2', 'input3', 'input4'];
  @ViewChildren('formRow') rows: any;
  @Input() isLoginLandingPage: boolean = false;
  public socket: any;
  url: any;
  msg: string = "";
  otpmsg: string = ''
  modalOptions: NgbModalOptions;
  user: SocialUser;
  loginForm: FormGroup;
  otpForm: FormGroup;
  userId: any = ''
  isSubmited: boolean = false;
  showOTPForm: boolean = false
  message: string;
  enteredPhone: string;
  userData: any;
  timeLeft: number;
  interval;
  emailData: [];
  slug: any;
  selectedRole = 2
  isService: any = '';
  public hasUser = false;
  public normalUser = {};
  isTextFieldType: boolean = true

  constructor(
    public activeModal: NgbActiveModal,
    public router: Router,
    public cs: CommonService,
    public ds: DataService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private chatService: ChatService,
    private fb: FormBuilder,
    private authService: SocialAuthService,
    private modalService: NgbModal,
    private _cookieservice: CookieService,
    public el: ElementRef, private activatedRoute: ActivatedRoute,
    private encrypt: EncryptionService,private spinner: NgxSpinnerService
  ) {
    this.url = '';
    this.modalOptions = {
      backdrop: "static",
      backdropClass: "customBackdrop",
    };
    this.otpForm = this.toFormGroup(this.formInput);
    this.isService = this._cookieservice.get('service');

  }

  startTimer() {
    this.timeLeft = 90;
    setTimeout(() => {
      if (this.rows && this.rows._results && this.rows._results.length) {
        console.log("in iff", this.rows._results[0].nativeElement)
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

  toFormGroup(elements) {
    const group: any = {};
    elements.forEach(key => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  blurEvent(phoneno) {
    if (phoneno.length == 14) {
      this.cs.get("user/getAllEmails/(+1)" + phoneno).subscribe(
        data => {
          if (data.status == 200) {
            this.emailData = data.data.data
          } else {
            this.msg = data.message;
          }
        },
        error => {

        }
      );
    }
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

    this.activatedRoute.params.subscribe((params: Params) => {
      this.slug = params['slug'];
    });

    this.emailData = [];
    this.loginForm = this.fb.group({
      // role: ['2', [Validators.required]],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(50), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      // password: ['', [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],

      rememberMe: [true]
    });

    this.checkRememberMe();
  }
  get f() { return this.loginForm.controls; }

  setLang(lang) {
    this.selectedLang = lang
    this.translate.use(lang);
    localStorage.currentLang = lang;
    this.ds.set(lang, "currentLang");
  }

  /**password show & hide*/
  togglePasswordFieldType() {
    this.isTextFieldType = !this.isTextFieldType;
  }


  /**Login Api calling with email and Password*/
  onLoggedin() {

    if (this.loginForm.value['rememberMe']) {
      // CryptoJS.AES.encrypt(this.loginForm.value["email"], this.encryptSecretKey).toString();
      localStorage.setItem("remember_email", this.encrypt.encryptionAES(this.loginForm.value["email"]));
      localStorage.setItem("remember_pass", this.encrypt.encryptionAES(this.loginForm.value["password"]));
    } else {
      localStorage.removeItem('remember_email');
      localStorage.removeItem('remember_pass');
      this.hasUser = false;
    }

    if (this.loginForm.invalid) {
      this.isSubmited = true;
      return;
    }
    delete this.loginForm.value.rememberMe;
    // this.loginForm.value['role'] = parseInt(this.loginForm.value['role']);
    this.isSubmited = true;
    this.cs.post("user/login", this.loginForm.value).subscribe(
      data => {
        if (data.status == 200) {
          this.toastr.success(data.message, 'Success')
          this.activeModal.dismiss("Cross click");
          this.isSubmited = false;
          let jsonToCookie = data.data
          this._cookieservice.put('user-starsin', JSON.stringify(jsonToCookie));
          this.ds.setProfile.emit(jsonToCookie)
          this.chatService.initSocket();
          this.chatService.authenticate(jsonToCookie.loginToken)
          if (data.data.role == 3) {
            if (data.data.isReviewed && data.data.isFirstLogin == true) {
              this.router.navigate(["celebrity/my-booking"]);
            } else {
              this.router.navigate(["celebrity/profile"]);
            }
          } else if (data.data.role == 2) {
            let service = '';
            service = this._cookieservice.get('service');

            if (this.slug) {
              if (service == "shoutout") {
                this.url = window.location.href;
                window.location = this.url;
              } else if (service == "igottalent") {
                this.url = window.location.href;
                window.location = this.url;
              } else if (service == "zoomcall") {
                this.url = window.location.href;
                window.location = this.url;
              } else {
                this.url = window.location.href + '?joiningFanClub=true';
                window.location = this.url;
              }

            } else {
              this.router.navigate(this.url);
            }
            //console.log(this.url);           
            //this.router.navigate(["fans/profile"]);
            //window.location = this.url;  
          }

        } else {
          this.toastr.error(data.message, 'Error')
          

          //this.msg = data.message;
        }
      },
      error => {
        this.toastr.error(error.error.message, 'Error')
        this.spinner.hide();
        

      }
    );
  }

  checkRememberMe() {
    if (localStorage.getItem("remember_email")) {
      var email_rem = localStorage.getItem("remember_email");
      var pass_rem = localStorage.getItem("remember_pass");
      this.loginForm.controls["email"].setValue(this.encrypt.decryptionAES(email_rem), { onlySelf: true });
      this.loginForm.controls["password"].setValue(this.encrypt.decryptionAES(pass_rem), { onlySelf: true });
      this.hasUser = true;
    }
  }

  verifyOtp() {
    this.otpmsg = "";
    if (this.timeLeft != 0) {
      this.isSubmited = true;
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
          this.isSubmited = false
          if (data.data) {
            this.applyLogin(this.userData);
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
  /*
   * Social medial login code here
   * Added relevant function
   * By: Pankaj
   * Created: 30.Sept.2019
   */

  /* Social login event
   * fired after click on button
   */

  /**Social Login */
  initiateSocialLogin(loginType) {
    this.loginForm.value['role'] = parseInt(this.loginForm.value['role']);
    let provider_id = "";
    if (loginType === "google") {
      provider_id = GoogleLoginProvider.PROVIDER_ID;
    } else {
      provider_id = FacebookLoginProvider.PROVIDER_ID;
    }
    this.authService.signIn(provider_id).then(user => {
      let reqObj = {
        name: user.name,
        email: user.email,
        fname_en: user.firstName,
        lname_en: user.lastName,
        profile_image: user.photoUrl,
        socialToken: user.authToken,
        loginType: loginType,
        role: this.loginForm.value['role']
      };
      console.log("reqObj", reqObj)
      this.userRegister(reqObj)
        .then((res: any) => {
          this.cs.showAlert("success", "Logged in successfully");
          this.applyLogin(res.data);
        })
        .catch(err => {
          this.msg = err;
          // this.cs.showAlert('error', err);
        });
    });
  }

  /* Check user by email */
  userRegister(data) {
    return new Promise((resolve, reject) => {
      this.cs.post("user/social-login", data).subscribe(
        res => {
          resolve(res);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  applyLogin(data) {

    localStorage.setItem("user-starsin", JSON.stringify(data));
    this._cookieservice.put('user-starsin', JSON.stringify(data));
    this.ds.set("loggedIn", "isLoggedInUser");
    this.ds.setProfile.emit(data)
    this.chatService.initSocket();
    this.chatService.authenticate(data.loginToken);
    this.activeModal.dismiss("Cross click");
    // this.cs.showAlert('success', data.message);
    if (data.role === 1) {
      this.router.navigate(["admin/dashboard"]);
    } else if (data.role === 2) {
      this.router.navigate(["fans/profile"]);
    } else {
      this.router.navigate(["celebrity/profile"]);
      this.ds.getNotifications.emit();
    }
  }

  /* Open signup model */
  signUp() {
    this.activeModal.dismiss();
    const modalRef = this.modalService.open(SignupComponent, { windowClass: 'modal-holder' });
    modalRef.componentInstance.title = "Signup";
  }

  /* Open forgot password model */
  forgot() {
    this.activeModal.dismiss();
    const modalRef = this.modalService.open(ForgotPasswordComponent, { windowClass: 'modal-holder' });
    modalRef.componentInstance.title = "Forgot Password";
  }

  goBack() {
    this.showOTPForm = false;
  }

  resendOTP() {
    this.cs.post("user/resend-otp", { _id: this.userId, name: this.userData.name, phoneNumber: this.enteredPhone }).subscribe(
      res => {
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

  switchLoginType() {
    this.buttonText = this.buttonText == "email" ? "phone number" : "email";
    this.msg = "";
    this.isSubmited = false;
    this.loginForm.get('email').clearValidators();
    this.loginForm.get('email').updateValueAndValidity();
    this.loginForm.get('phoneNumber').clearValidators();
    this.loginForm.get('phoneNumber').updateValueAndValidity();
  }


  signupAsFan() {
    this.activeModal.dismiss();
    const modalRef = this.modalService.open(SignupComponent, {
      windowClass: "modal-holder",
    });
    modalRef.componentInstance.title = "Signup";
  }

  signupAsCel() {
    this.activeModal.dismiss();
    const modalRef = this.modalService.open(SignupCelebrityComponent, {
      windowClass: "modal-holder",
    });
    modalRef.componentInstance.title = "Signup";
  }
}
