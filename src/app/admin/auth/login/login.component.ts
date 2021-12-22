import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ChatService } from "../../../shared/services/chat.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  admin: any;
  loggedInAdmin: any;

  constructor(
    private commonService: CommonService, private toastr: ToastrService, private router: Router,
    private spinner: NgxSpinnerService,
    private chatService: ChatService,
    private _cookieservice: CookieService) {
    this.admin = {};

  }

  ngOnInit(): void {
    this._cookieservice.removeAll();
  }

  login(loginForm) {
    let apiPath = `user/login`;
    //this.admin.role = 1;
    this.commonService.post(apiPath, this.admin).subscribe(result => {
      if (result && result.status == 200) {
        this._cookieservice.put('starin-admin', JSON.stringify(result.data));
        this.loggedInAdmin = JSON.parse(this._cookieservice.get('starin-admin'));
        this.chatService.initSocket();
        this.chatService.authenticate(this.loggedInAdmin.loginToken)
        if(this.loggedInAdmin.role == 1) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/admin/profile']);
        }
        
        loginForm.resetForm();
      } else {
        this.toastr.error(result.message)
      }

    }, err => {
      console.log(err);
      // loginForm.resetForm();
      this.commonService.handleError(err);
    });
  }


}
