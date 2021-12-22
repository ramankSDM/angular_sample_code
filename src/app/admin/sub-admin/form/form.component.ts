import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countrycodes } from "../../../shared/_json_files/countryCode"
import { Location } from '@angular/common';
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
  id: String;
  now = new Date();
  emailChk = false;
  countryCodeList = countrycodes
  rolesData: any;
  itemTypeList:any;
  selectedOrderIds = [];
  itemTypeChk: boolean = false;

  constructor(
    public cs: CommonService,
    private fb: FormBuilder,
    public router: Router,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.getRoles();
    this.getPermissions();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id) {
        this.isEditable = true;
        this.getById();
      }
    });
    this.frm = this.fb.group({
      fname_en: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lname_en: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern("^[0-9]*$")]],
      role: [4, [Validators.required]],
      std_code: [this.countryCodeList[0].isdcode, [Validators.required]],
      subRole: ['', [Validators.required]],
      permission: [[], []]
    });

   
  }
  /*
  Name: getById
  Description: Get fan detail by id
  */
  async getById() {
    let path = 'fans/get-by-id';
    return new Promise((resolve, reject) => {
      this.cs.getById(path, this.id).subscribe(async res => {

        if (res.data.permission && res.data.permission.length) {
          res.data.permission.forEach(data => {
            this.selectedOrderIds.push(data);
          });
        }
        this.itemTypeList.forEach(data => {
          data['flag'] = false;
          if (this.selectedOrderIds.includes(data._id)) {
            data['flag'] = true;
          }
        });

        this.frm.patchValue(res.data);
      },
        (err) => {
          this.cs.loading(false)
          this.cs.handleError(err);
          // this._location.back();
        }
      );
    });
  }
  /*
   Name: save
   Description: Save or Update sub-admin
   */
  save() {
    if (this.frm.invalid) {
      this.isSubmited = true;
      if (this.selectedOrderIds.length <= 0) {
        this.itemTypeChk = true
        return;
      }
      return;
    }

    if (this.selectedOrderIds.length <= 0) {
      this.isSubmited = true;
      this.itemTypeChk = true
      return;
    }
    this.frm.value.permission = this.selectedOrderIds
    if (this.id) {
      this.update();
    } else {      
      this.add();
    }
  }
  /*
    Name: add
    Description: Add Sub-admin
    */
  add() {
    let path = 'user/add-user';
    this.cs.post(path, this.frm.value).subscribe(res => {
      if (res.status == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/admin/sub-admin'])
      } else {
        this.toastr.error(res.message);
      }
    },
      (err) => {
        this.cs.loading(false)
        this.cs.handleError(err);
        this.router.navigate(['/admin/sub-admin'])
      }
    );
  }
  /*
    Name: update
    Description: Update the fan
    */
  update() {
    this.frm.value.id = this.id
    let path = `user/update-user`;
    this.cs.put(path, this.frm.value).subscribe(res => {
      if (res.status == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/admin/sub-admin'])
      } else {
        this.toastr.error(res.message);
      }

    },
      (err) => {
        this.cs.handleError(err);
        this.router.navigate(['/admin/sub-admin'])
      }
    );
  }

  /*
  Name: getRoles
  Description: function call to get all roles in the system
  */
  getRoles() {
    let path = 'roles/get-all';
    return new Promise((resolve, reject) => {
      this.cs.queryParams(path, { count: 100, page: 1 }).subscribe(async res => {
        this.rolesData = res.data.data
      },
        (err) => {
          this.cs.loading(false)
          this.cs.handleError(err);
        }
      );
    });
  }

  /*
   Name: getPermissions
   Description: function call to get all permissions in the system
   */
  getPermissions() {
    let path = 'permissions/get-all';
    return new Promise((resolve, reject) => {
      this.cs.queryParams(path, { count: 100, page: 1 }).subscribe(async res => {
        this.itemTypeList = res.data.data;

        this.itemTypeList.forEach(data => {
          data['flag'] = false;
          if (this.selectedOrderIds.includes(data._id)) {
            data['flag'] = true;
          }
        });


      },
        (err) => {
          this.cs.loading(false)
          this.cs.handleError(err);
        }
      );
    });
  }

  selectItemType(id, status) {
    const index = this.selectedOrderIds.indexOf(id);
    if (!status && index > -1) {
      this.selectedOrderIds.splice(index, 1);
    } else if (status && index == -1) {
      this.selectedOrderIds.push(id);
    }
    if (this.selectedOrderIds.length > 0) {
      this.itemTypeChk = false
      return;
    } else {
      this.itemTypeChk = true
      return;
    }

  }

}


