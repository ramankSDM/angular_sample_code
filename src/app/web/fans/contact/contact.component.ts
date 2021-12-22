import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DataService } from "../../../services/data.service";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {contact_admin_list} from "../../../shared/_json_files/constant"

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  frm: FormGroup;
  isSubmited: boolean = false;
  selectedLang: any = 'en';
  langs: any = [];
  sub_dropdown = contact_admin_list

  constructor(private _cookieservice: CookieService,
    public ds: DataService,
    public cs: CommonService,
    private fb: FormBuilder,
    public router: Router,private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService, private commonService: CommonService,
    private translate: TranslateService) { 

    }

  ngOnInit(): void {
    this.langs = [{ name: 'English', code: 'en' }, { name: 'Arabic', code: 'ar' }];
    this.selectedLang = localStorage.currentLang ? localStorage.currentLang : 'en'
    this.ds.get().subscribe(async (data) => {
      if (data.key == "currentLang") {
        this.selectedLang = data.set;
        this.translate.use(this.selectedLang)
      }
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLang = this.translate.currentLang ? this.translate.currentLang : 'en';
    });

    // this form data
    this.frm = this.fb.group({   // Signup form      
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]       
    });
  }

  /*
  Name: save
  Description: Submit on contact form
  */
  save() {
    this.spinner.show();
    if (this.frm.invalid) {
      this.spinner.hide()
      this.isSubmited = true;
      return;
    }
    this.add();
  }

  /*
  Name: add
  Description: Save contact info into DB
  */
  add() {
    let path = 'contact/add';
    let options = {       
      subject: this.frm.value.subject,
      message: this.frm.value.message
    };
    this.commonService.post(path, options).subscribe(response => {
      this.frm.controls["subject"].setValue('');
      this.frm.controls["message"].setValue('');
      this.toastr.success('Your message has been sent. Our support team will review the issue to resolve it or contact you soon.');
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });     
  }

}
