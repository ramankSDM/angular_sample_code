import { Component, OnInit } from '@angular/core';
import { CommonService } from './../../shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  token: any;
  email: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    public cs: CommonService) {

    this.activatedRoute.params.subscribe(params => {
      this.token = params.token;
      this.email = params.email;
    })

  }

  ngOnInit() {
    if (this.token) {
      const obj = {
        token: this.token,
        email: this.email
      }
      this.cs.put('user/email-verification', obj)
        .subscribe(res => {
          if (res.status == 200) {
            this.toastr.success('Email Verified Successfully', 'Success')
            this.router.navigate(['/']);
          } else {
            this.toastr.error(res.message, 'Error')
            this.router.navigate(['/']);
          }
        }, error => {
          this.toastr.error(error.message, 'Error')
        });
    }
  }

}
