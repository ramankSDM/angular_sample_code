import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';

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
  constructor(
    public cs: CommonService,
    private fb: FormBuilder,
    public router: Router,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if(this.id){
        this.isEditable = true;
        this.getById();
      }
    });
    this.frm = this.fb.group({   // Signup form
      question_en: ['', [Validators.required]],
      question_ar:['', [Validators.required]],
      answer_en: ['', [Validators.required]],
      answer_ar:['', [Validators.required]]
    });
  }

   /*
  Name: getById
  Description: Get faq detail by id
  */
   async getById() {
    let path = 'faqs/get-by-id';
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
  Description: Save or Update FAQ
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
  Description: Add FAQ
  */
  add() {   
    let path = 'faqs/addFaq';
      this.cs.post(path,this.frm.value).subscribe(res=> {
        if (res.status == 200) {
          this.toastr.success(res.message);
          this.router.navigate(['/admin/faq'])
        } else {
          this.toastr.error(res.message);
        }
    },
    (err) =>{  
      this.cs.loading(false)
      this.cs.handleError(err);
      this.router.navigate(['/admin/faq'])
     }
    );
  }
/*
  Name: update
  Description: Update the FAQ
  */
  update() {
    this.frm.value.id=this.id
    let path = `faqs/updateFaq`;
    this.cs.put(path,this.frm.value).subscribe(res=> {
      if (res.status == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/admin/faq'])
      } else {
        this.toastr.error(res.message);
      }
      
    },
    (err) =>{  
      this.cs.handleError(err);
      this.router.navigate(['/admin/faq'])
     }
    );
  }

}
