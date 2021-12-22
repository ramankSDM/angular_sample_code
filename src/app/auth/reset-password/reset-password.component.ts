import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { CommonService } from './../../shared/services/common.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [routerTransition()]
})
export class ResetPasswordComponent implements OnInit {
    // forgotForm: FormGroup;
    resetForm: FormGroup;
    isForgotSubmited: boolean = false;
    isResetSubmited: boolean = false;
    resetpassword: boolean = false;
    otp:any;

  constructor(
    public cs: CommonService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createResetForm()
  }
/** Create Reset form with default validation*/
  createResetForm() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.otp = params['id'];
    });
    this.resetpassword = true;
    this.resetForm = this.fb.group({  // forgot password form
      otp: [this.otp, [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

/** Reset Passworj Api calling*/
  resetPassword() {
    if (this.resetForm.invalid) {
      this.isResetSubmited = true;
      return;
    }
    let path = 'user/reset-password';
    this.cs.post(path, this.resetForm.value)
      .subscribe( data => {
        if (data.status == 200) {
          this.cs.showAlert('success', data.message);
          this.router.navigate(['/login']);
        } else {
          this.cs.showAlert('warn', data.message);
        }
    }, error => { });
  }

}
