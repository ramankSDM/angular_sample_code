import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countrycodes } from "../../../shared/_json_files/countryCode"
import {Location} from '@angular/common';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
 
  frm: FormGroup;
  isEditable: boolean = false;
  isSubmited: boolean = false;
  id:String;
  now = new Date();
  emailChk = false;
  countryCodeList=countrycodes
  constructor(
    public cs: CommonService,
    private fb: FormBuilder,
    public router: Router,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if(this.id){
        this.isEditable = true;
        this.getById();
      }
    });
    this.frm = this.fb.group({  
      fname_en: ['', [Validators.required]],
      lname_en:['', [Validators.required]],
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
      phone:['', [Validators.required]],
      role:[2, [Validators.required]],
      std_code:[this.countryCodeList[0].isdcode, [Validators.required]],
    });
  }
  /*
  Name: getById
  Description: Get fan detail by id
  */
  async getById() {
    let path = 'fans/get-by-id';
    return new Promise((resolve, reject) => {
      this.cs.getById(path,this.id).subscribe(async res => { 
        this.frm.patchValue(res.data);
      },
      (err) =>{  
        this.cs.loading(false)
        this.cs.handleError(err);
        // this._location.back();
       }
      );
    });
  }
 /*
  Name: save
  Description: Save or Update fan
  */
  save(){
    if (this.frm.invalid) {
      this.isSubmited = true;
      return;
    }
    if(this.id) {
      this.update();
    } else {
      this.add();
    }
  }
/*
  Name: add
  Description: Add Fan
  */
  add() {   
    let path = 'user/add-user';
      this.cs.post(path,this.frm.value).subscribe(res=> {
        if (res.status == 200) {
          this.toastr.success(res.message);
          this.router.navigate(['/admin/fans'])
        } else {
          this.toastr.error(res.message);
        }
    },
    (err) =>{  
      this.cs.loading(false)
      this.cs.handleError(err);
      this.router.navigate(['/admin/fans'])
     }
    );
  }
/*
  Name: update
  Description: Update the fan
  */
  update() {
    this.frm.value.id=this.id
    let path = `user/update-user`;
    this.cs.put(path,this.frm.value).subscribe(res=> {
      if (res.status == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/admin/fans'])
      } else {
        this.toastr.error(res.message);
      }
      
    },
    (err) =>{  
      this.cs.handleError(err);
      this.router.navigate(['/admin/fans'])
     }
    );
  }

}


