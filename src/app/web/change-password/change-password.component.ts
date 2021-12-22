import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  fan: any;
  cancelURL: any;
  selectedLang: any = 'en';
  langs: any = [];
  constructor(private commonService: CommonService, private router: Router,
    private _cookieservice: CookieService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private translate: TranslateService,public ds: DataService) {
    this.fan = {};
    this.cancelURL = '';
  }

  ngOnInit() {
    if (this.router.url == '/celebrity/change-password') {
      this.cancelURL = '/celebrity/profile';
    } else {
      this.cancelURL = '/fans/profile';
    }
    // language selection codes
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

  /*
   Name: change password
   Description: change user password from profile
   */
  changePassword(profileForm: NgForm) {
    this.spinner.show();
    let apiPath = `user/change-password`;
    this.commonService.post(apiPath, this.fan).subscribe(result => {
      this.toastr.success('Password Updated Successfully');
      this.spinner.hide();
      profileForm.reset();
      this.router.navigate(['/fan/profile']);
    }, err => {
      profileForm.reset();
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

}
