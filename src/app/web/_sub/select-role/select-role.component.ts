import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import {
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.scss']
})
export class SelectRoleComponent implements OnInit {
  userId
  frm: FormGroup;
  constructor( private _cookieservice: CookieService,public activeModal: NgbActiveModal, public cs: CommonService, private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.frm = this.fb.group({
      roleId: ['', [Validators.required ]]
    })
  }  

  save(){
    let path = 'user/updateProfile';
    let obj = {
      role: this.frm.value.roleId,
    }
    this.cs.post(path, obj).subscribe(async res => {
      if (res.status == 200) {
        let loginData = JSON.parse(this._cookieservice.get("user-starsin"));
        this._cookieservice.removeAll();
        loginData.role = this.frm.value.roleId
        this._cookieservice.put('user-starsin', JSON.stringify(loginData));
        this.toastr.success(res.message);
        this.activeModal.close();
      }
    })
  }

}
