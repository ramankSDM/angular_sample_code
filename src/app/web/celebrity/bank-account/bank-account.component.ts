import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl, MinLengthValidator } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from './../../../../environments/environment'
import {
  CommonService
} from 'src/app/services/common.service';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {

 // url = environment.apiUrl + 'common/upload';
  uploadedFiles: any[] = [];
  imgArray: any = [];
  userForm: FormGroup;
  isSubmited: boolean = false;
  fileArr:any;
  Id:string;
  email:string;
  userDetails:any;
  now = new Date();
  isEditAble=false;
  verificationDoc:boolean=false
  constructor( 
    public cs: CommonService,
    private fb: FormBuilder,
    public router: Router,
    // private _location: Location,
    ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      profile:['', []],
      account_holder_name:['', [Validators.required]],
      account_holder_type:['individual', [Validators.required]], 
      account_number:['', [Validators.required]],
      routing_number:['', [Validators.required]],         
      firstName:['', [Validators.required]],
      lastName:['', [Validators.required]],
      phoneNumber:['', [Validators.required]], 
      type:['individual', [Validators.required]],
      dob:['', [Validators.required]],
      line1:['', [Validators.required]],
      city:['', [Validators.required]],
      postal:['', [Validators.required]],
      state:['', [Validators.required]], 
    });
  }

     /* Update Bank Details */
  save(){   
    if (this.userForm.invalid) {
      this.isSubmited = true;
      return;
    } 
    if(!this.fileArr){
      this.verificationDoc=true;
      return;
    }   
    this.update();   
  }
 /* Update Bank Details */
  update() {
    let path = `user/createAccount`;  
    this.userForm.value.dob = new Date(this.userForm.value.dob);
    var obj={
    verificationDocumentData:this.fileArr?this.fileArr:"",
    account: {
      accountHolder: this.userForm.value.account_holder_name,
      accountHolderType: this.userForm.value.account_holder_type,
      accountNumber: this.userForm.value.account_number,
      routing_number: this.userForm.value.routing_number,
      city: this.userForm.value.city,
    }, 
    individual : {
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      phoneNumber: this.userForm.value.phoneNumber,
      type: this.userForm.value.type,
      address: {
        line1: this.userForm.value.line1,
        city: this.userForm.value.city,
        postal: this.userForm.value.postal,
        state: this.userForm.value.state,
      },
      dob:{
        year : this.userForm.value.dob.getFullYear(),
        month : this.userForm.value.dob.getMonth()+1,
        day : this.userForm.value.dob.getDate(),
      } 
    }
  }  
  // const formData: FormData = new FormData();
  // formData.append('account', JSON.stringify(obj.account))   
  // formData.append('individual', JSON.stringify(obj.individual))
  // formData.append('id', obj.id)
  // formData.append('email', obj.email)
  // formData.append('verificationDocumentData', obj.verificationDocumentData);
  // console.log("formData", formData)
    this.cs.post(path,obj).subscribe(res=> {
      console.log("res+++++++++", res)
      if (res.status == 200) {
        // this.cs.showAlert('success', res.message);
       // this._location.back(); 
      } else {
       // this.cs.showAlert('warn', res.message);
      }      
    }, error => {
     // this.cs.showAlert('warn', error);
    });
  }
  
 /* Upload Document verify */
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.fileArr = event.target.files[0];
      this.verificationDoc=true;
      this.userForm.patchValue({
        profile:this.fileArr
      })
    }
  }

}
