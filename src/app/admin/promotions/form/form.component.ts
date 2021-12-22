import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import {toastrMsg} from '../../../shared/_json_files/constant'


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  frm: FormGroup;
  msg = toastrMsg;
  isEditable: boolean = false;
  isSubmited: boolean = false;
  id:String;
  now: Date;
  emailChk = false;
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
    this.frm = this.fb.group({   // Signup form
      code: ['', [Validators.required]],
      title_en: ['', [Validators.required]],
      title_ar:['', [Validators.required]],
      description_en: ['', [Validators.required]],
      description_ar: ['', [Validators.required]],
      discountType: ['',[Validators.required]],
      discount: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],
    });
  }
   /* Update promotion By Id  */
  async getById() {
    let path = 'promocode/get-by-id';
    return new Promise((resolve, reject) => {
      this.cs.getById(path,this.id).subscribe(async res => { 
        res.data.expiryDate = new Date(res.data.expiryDate)
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
 /* Create Or Update promotion */
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
/* Create promotion */
  add() {   
    let path = 'promocode/add';
      this.cs.post(path,this.frm.value).subscribe(res=> {
        if (res.status == 200) {
          this.toastr.success(this.msg[0].promotion_code);

          this.router.navigate(['/admin/promotions'])
        } else {
          this.toastr.error(res.message);
        }
    },
    (err) =>{  
      this.cs.loading(false)
      this.cs.handleError(err);
      this.router.navigate(['/admin/promotions'])
     }
    );
  }
/* Update promotion */
  update() {
    this.frm.value.id=this.id
    let path = `promocode/update`;
    this.cs.put(path,this.frm.value).subscribe(res=> {
      if (res.status == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/admin/promotions'])
      } else {
        this.toastr.error(res.message);
      }
      
    },
    (err) =>{  
      this.cs.handleError(err);
      this.router.navigate(['/admin/promotions'])
     }
    );
  }

}



