import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { countrycodes } from "../../../shared/_json_files/countryCode"

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
  selectedOrderIds = [];
  itemTypeChk: boolean = false;
  itemTypeChklength: boolean = false;
  selectchk = [];
  itemTypeList = [];
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
    this.getItemTypes();
    this.formCreated();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if(this.id){
        this.isEditable = true;
        // this.getById();
      }
    });
   
  }

  formCreated() {
    this.frm = this.fb.group({   // Signup form
      fname_en: ['', [Validators.required]],
      lname_en:['', [Validators.required]],
      fname_ar: ['', [Validators.required]],
      lname_ar:['', ],
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
      phone:['', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      role:[3, [Validators.required]],
      std_code:[this.countryCodeList[0].isdcode, [Validators.required]],
      item_type_ids: this.fb.array([...this.selectchk]),
      category:[[], []],
    });
    if(this.id){
      this.getById();
    }
  }
  /*
  Name: getById
  Description: Get celebrity detail by id
  */
  async getById() {
    let path = 'fans/get-by-id';
    return new Promise((resolve, reject) => {
      this.cs.getById(path,this.id).subscribe(async res => { 
        if (res.data.category && res.data.category.length) {
          res.data.category.forEach(data => {    
            this.selectedOrderIds.push(data);
          });
        }
        this.itemTypeList.forEach(data => {
          data['flag'] = false;
          if (this.selectedOrderIds.includes(data._id)) {
            data['flag'] = true;
          }
        });
        this.frm.patchValue({...res.data});
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
  Name: getItemTypes
  Description: Get All categories
  */
  getItemTypes() {
    this.spinner.show();
    let path = `category/get-all-category`;
    let options = {
      page:1,
      count: 100000,
      search: "",
      sortBy: "",
      sort: "",
      status: true
    };
    this.cs.queryParams(path, options).subscribe(response => {
      this.itemTypeList = response.data.data;
      this.selectchk = this.itemTypeList.map(val => {
        return false;
      })
      this.itemTypeList.forEach(data => {
          data['flag'] = false;
        if (this.selectedOrderIds.includes(data._id)) {
          data['flag'] = true;
        }
      });
      this.formCreated();
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.cs.handleError(err);
    });
  }

  /*
  Name: selectItemType
  Description: Check item type
  */
  selectItemType(id, status) {   
    const index = this.selectedOrderIds.indexOf(id);
    if (!status && index > -1) {
      this.selectedOrderIds.splice(index, 1);
    } else if (status && index == -1) {
      this.selectedOrderIds.push(id);
    }
    if (this.selectedOrderIds.length > 3) {
      this.itemTypeChklength = true     
    }else{
      this.itemTypeChklength = false     
    }
    if (this.selectedOrderIds.length > 0) {
      this.itemTypeChk = false
      return;
    } else {
      this.itemTypeChk = true
      return;
    }
    
  }
 /*
  Name: save
  Description: Save or Update celebrity
  */
  save(){
    if (this.frm.invalid) {
      this.isSubmited = true;
      if (this.selectedOrderIds.length <= 0) {
        this.itemTypeChk = true
        return;
      }
      if (this.selectedOrderIds.length >3) {
        this.itemTypeChklength = true
        return;
      }
      return;
    }
    if (this.selectedOrderIds.length <= 0) {
      this.isSubmited = true;
      this.itemTypeChk = true
      return;
    } 
    if (this.selectedOrderIds.length >3) {
      this.isSubmited = true;
      this.itemTypeChklength = true
      return;
    }
    this.frm.value.category=this.selectedOrderIds
    if(this.id) {
      this.update();
    } else {
      this.add();
    }
  }
/*
  Name: add
  Description: Add celebrity
  */
  add() {   
    let path = 'user/add-user';
      this.cs.post(path,this.frm.value).subscribe(res=> {
        if (res.status == 200) {
          this.toastr.success(res.message);
          this.router.navigate(['/admin/celebrities'])
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
  Description: Update the celebrity
  */
  update() {
    this.frm.value.id=this.id
    let path = `user/update-user`;
    this.cs.put(path,this.frm.value).subscribe(res=> {
      if (res.status == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/admin/celebrities'])
      } else {
        this.toastr.error(res.message);
      }
      
    },
    (err) =>{  
      this.cs.handleError(err);
      this.router.navigate(['/admin/celebrities'])
     }
    );
  }

}


