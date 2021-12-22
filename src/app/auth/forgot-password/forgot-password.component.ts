import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { CommonService } from './../../shared/services/common.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DataService } from './../../services/data.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [routerTransition()]
})
export class ForgotPasswordComponent implements OnInit {
  selectedLang: any = 'en';
  langs: any = [];
  forgotForm: FormGroup;
  resetForm: FormGroup;
  msg: string = ""
  successMsg: string = ""
  // tslint:disable-next-line:no-inferrable-types
  isForgotSubmited: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  // isResetSubmited: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  resetpassword: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    public cs: CommonService,
    public router: Router,
    private toastr: ToastrService,
    public ds: DataService,
    private translate: TranslateService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.forgotForm = this.fb.group({  // forgot password form
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
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
  get f() { return this.forgotForm.controls; }

  setLang(lang) {
    this.selectedLang = lang
    this.translate.use(lang);
    localStorage.currentLang = lang;
    this.ds.set(lang, "currentLang");
  }
  /**Forgot password Api calling with emai*/
  forgotPassword() {
    if (this.forgotForm.invalid) {
      this.isForgotSubmited = true;
      return;
    }
    this.forgotForm.value['email'] = this.forgotForm.value.email.toLowerCase();
    let path = 'user/forgotPassword';
    this.cs.post(path, this.forgotForm.value)
      .subscribe(data => {
        if (data.status == 200) {
          this.toastr.success(data.message, 'Success')
          //this.successMsg= data.message
          this.activeModal.close();
          this.router.navigate(['/']);
          //this.cs.showAlert('success', data.message);
          // this.createResetForm();
        } else {
          this.toastr.error(data.message, 'Error')
          //this.msg=data.message;
          // this.cs.showAlert('warn', data.message);
        }
      }, error => {
        this.toastr.error(error.error.message, 'Error')
      });
  }

  /**Reset password form default validation*/
  // createResetForm() {
  //   this.resetpassword = true;
  //   this.resetForm = this.fb.group({  // forgot password form
  //     otp: ['', [Validators.required, Validators.maxLength(100)]],
  //     password: ['', [Validators.required, Validators.minLength(6)]],
  //   });
  // }

  /**Reset password Api calling with varification code*/
  // resetPassword() {
  //   if (this.resetForm.invalid) {
  //     this.isResetSubmited = true;
  //     return;
  //   }
  //   let path = 'user/resetPassword';
  //   this.cs.post(path, this.resetForm.value)
  //     .subscribe( data => {
  //       if (data.status == 200) {
  //         this.successMsg= data.message
  //         this.cs.showAlert('success', data.message);  
  //         this.activeModal.close();                
  //       } else {
  //         this.msg=data.message;
  //         // this.cs.showAlert('warn', data.message);
  //       }
  //   }, error => { });
  // }
}
