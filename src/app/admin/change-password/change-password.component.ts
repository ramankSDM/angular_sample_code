import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  admin: any;
  constructor(private commonService: CommonService, private router: Router,
    private _cookieservice: CookieService, private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    this.admin = {};
  }

  ngOnInit(): void {
  }

  /*
  Name: changePassword
  Description: Update the password
  */
  changePassword(profileForm: NgForm) {
    this.spinner.show();
    let apiPath = `user/change-password`;
    this.commonService.post(apiPath, this.admin).subscribe(result => {
      this.toastr.success('Password Updated Successfully');
      this.spinner.hide();
      profileForm.reset();
      this.router.navigate(['/admin/dashboard']);
    }, err => {
      profileForm.reset();
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

}
