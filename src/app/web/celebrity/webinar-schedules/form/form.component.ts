
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Params,Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {formatDate,DatePipe } from '@angular/common';
import { timeList } from "../../../../shared/_json_files/constant"
import { DataService } from 'src/app/services/data.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { topicList } from "../../../../shared/_json_files/constant"

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  cancelURL: any;
  frm: FormGroup;
  isSubmited: boolean = false;
  date: Date;
  minDate: Date;
  timeData = timeList
  topic_list = topicList
  isEditable: boolean = false;
  id:String;  
  noOfDays: boolean = false;
  noOfDaysError: boolean = false;
  selectedZone: any;
  selectedLang: any = 'en';
  langs: any = [];

  constructor(private commonService: CommonService, private router: Router,
    private _cookieservice: CookieService, private toastr: ToastrService,
    private spinner: NgxSpinnerService,private fb: FormBuilder,private activatedRoute: ActivatedRoute, private translate: TranslateService, public ds: DataService) { 
      this.cancelURL = '';
      this.minDate = new Date(); 
      this.selectedZone = { name: "Asia/Dubai (+00:00)", nameValue: "Asia/Dubai", timeValue: "+00:00", group: "Asia", abbr: "GMT" };    
  }

  ngOnInit(){
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log('this.id',this.id,params)
      if(this.id){
        this.isEditable = true;       
        this.getById();
      }
    }); 
    this.cancelURL = '/celebrity/webinars';
    this.frm = this.fb.group({   // Availability form      
      title: ['', [Validators.required]], 
      description: ['', [Validators.required]], 
      topic: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      webinar_date: ['', [Validators.required]],
      webinar_id: [''],
      number_of_participants: ['', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      booked_price: ['', [Validators.required]],
      recorded_price: ['', [Validators.required]], 
      webinar_type: ['single'],
      no_of_days: ['',],
      special_instructions: [''] ,
      start_time:['', [Validators.required]], 
      timezone: [''],
      timezoneobject: ['', [Validators.required]],  
    });


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
  }

   /* Get webinar By Id  */
   async getById() {    
    let path = 'celebrity/get-webinar-by-id';
    return new Promise((resolve, reject) => {
      this.commonService.getById(path,this.id).subscribe(async res => {  
        console.log('res.data',res.data)  
        res.data.webinar_date = new Date(res.data.webinar_date) 
        this.frm.controls["webinar_id"].setValue( res.data.webinar_id);    
        this.frm.patchValue(res.data);
        if(res.data.webinar_type == 'multiple'){
          this.noOfDays = true;
        }
        if (res.data.timezone) {
          var timeZoneArr = res.data.timezone.split('/');
          this.selectedZone = { name: res.data.timezone + " (+00:00)", nameValue: res.data.timezone, timeValue: "+00:00", group: timeZoneArr[0], abbr: "GMT" };
        }
      },
      (err) =>{  
        this.commonService.loading(false)
        this.commonService.handleError(err);
      }
      );
    });
  }

  /*
  Name: save
  Description: When click on save button 
  */
  save() {
    this.spinner.show();  
    console.log(this.frm.value);
    if(this.frm.value.webinar_type == 'multiple' && this.frm.value.no_of_days == null){
      this.noOfDaysError = true;
      this.spinner.hide()
      this.isSubmited = true;
      return;
    }  
    if (this.frm.invalid) {
      this.spinner.hide()
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
  Description: Add/Update schedule in DB 
  */
  add() {     
    let zoom = this.frm.value.webinar_date;
    let pipe = new DatePipe('en-US');      
    var myShortFormat = pipe.transform(zoom, 'fullDate');
    let time_slot = this.frm.value.start_time;
    var shortFormatTime = pipe.transform(time_slot, 'fullTime');
    var zoomDateTime = myShortFormat+' '+shortFormatTime;

    this.frm.value.webinar_date = zoomDateTime;

    this.frm.value.timezone = this.frm.value.timezoneobject.nameValue;
    delete this.frm.value.timezoneobject;

    console.log('this.frm.value',this.frm.value)
    //return;  
    this.spinner.hide();
    let path = `celebrity/create-webinar`;   
    this.commonService.post(path, this.frm.value).subscribe(response => {
      this.toastr.success('Webinar added successfully'); 
      this.router.navigate(['/celebrity/webinars'])     
      this.spinner.hide();  
    }, err => {
      this.spinner.hide();
      this.router.navigate(['/celebrity/webinars'])
      this.commonService.handleError(err);
    });  
  }

  changeType(type) {
    console.log('type',type);   
    if (type == 'single') { 
      this.noOfDays = false;    
      delete this.frm.value.no_of_days 
    } else {
      this.noOfDays = true;
    }
  }

   /* Update Webinar */
   update() {
    
    this.frm.value.id=this.id;    
    console.log('this.frm.value',this.frm.value)
    this.frm.value.timezone = this.frm.value.timezoneobject.nameValue;
    delete this.frm.value.timezoneobject;
    if(this.frm.value.webinar_type == "single")
    {
      this.frm.value.no_of_days = 0;
    }

    //return
    let path = `celebrity/update-webinar`;
    this.commonService.post(path,this.frm.value).subscribe(res=> {
      if (res.status == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/celebrity/webinars'])
      } else {
        this.toastr.error(res.message);
      }
      
    },
    (err) =>{  
      this.commonService.handleError(err);
      this.router.navigate(['/celebrity/webinars'])
    }
    );
  }

  /*
  Name: changeType
  Description: Change webinar type
  */
 

  onSelect(event){
    console.log('event', event);
    //return;
    let CFUser = this._cookieservice.get('user-starsin');
    let NewCFUser = JSON.parse(CFUser);
    let userId = NewCFUser._id;
    let path = `booking/check-time-slots`;
    let options = {
      userId: NewCFUser._id,
      zoomBookingDateTime: event
    };   
    this.commonService.queryParams(path, options).subscribe(response => {      
      if(response.data == false){
        this.frm.controls["webinar_date"].setValue('');
        this.toastr.error(response.message);           
      } else{
        //available on zoom
      }            
    }, err => {
      this.commonService.handleError(err);
    }); 
  }
}
