import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  admin: any;

  constructor(private commonService: CommonService,
    private toastr: ToastrService, private router: Router,
    private spinner: NgxSpinnerService) {
    this.admin = {};
  }

  ngOnInit(): void {
  }

  reset(form: NgForm) {
    this.spinner.show();
    let apiPath = `user/forgotpassword`;
    this.commonService.post(apiPath, this.admin).subscribe(result => {
      this.spinner.hide();
      form.resetForm();
      if(result && result.status==200){
        this.router.navigate(['/admin/login']);
        this.toastr.success('Password Sent to your email. Check your Email')        
      }else{
        this.toastr.error(result.message)  
      }
    }, err => {
      form.resetForm();
      this.commonService.handleError(err);
    });
  }

}
