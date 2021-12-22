import { Component, OnInit } from '@angular/core';
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
    ) { }

    ngOnInit() {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.id = params['id'];
        if(this.id){
          this.isEditable = true;
          this.getById();
        }
      });
      this.frm = this.fb.group({   // Signup form
        title_en: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
        title_ar:['', [Validators.required, Validators.pattern('^[a-zA-Z؀-ۿ]+$')]]
      });
    }

     /* Update Tag By Id  */
    async getById() {
      let path = 'tags/get-by-id';
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
    /* Create Or Update Tag */
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
    /* Create Tag */
    add() {   
      let path = 'tags/add';
        this.cs.post(path,this.frm.value).subscribe(res=> {
          if (res.status == 200) {
            this.toastr.success(res.message);
            this.router.navigate(['/admin/tags'])
          } else {
            this.toastr.error(res.message);
          }
      },
      (err) =>{  
        this.cs.loading(false)
        this.cs.handleError(err);
        this.router.navigate(['/admin/tags'])
      }
      );
    }
    /* Update Tag */
    update() {
      this.frm.value.id=this.id
      let path = `tags/update`;
      this.cs.put(path,this.frm.value).subscribe(res=> {
        if (res.status == 200) {
          this.toastr.success(res.message);
          this.router.navigate(['/admin/tags'])
        } else {
          this.toastr.error(res.message);
        }
        
      },
      (err) =>{  
        this.cs.handleError(err);
        this.router.navigate(['/admin/tags'])
      }
      );
    }

}
