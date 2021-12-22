import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DataService } from "../../../services/data.service";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import {formatDate } from '@angular/common';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-zoom-call',
  templateUrl: './zoom-call.component.html',
  styleUrls: ['./zoom-call.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZoomCallComponent implements OnInit {
  frm: FormGroup;
  isSubmited: boolean = false;
  daysSelected: any[] = [];
  event: any;
  scheduleList:[];
  daysAndintrevals:any;
  selectedLang: any = 'en';
  langs: any = [];
  timezone:any; 

  days = [
    {
      'day':'All',
      'label':'all',
      'intervals':[
        {'label':'Morning','start_time':'all_morning_start_time','end_time':'all_morning_end_time'},
        {'label':'Afternoon','start_time':'all_afternoon_start_time','end_time':'all_afternoon_end_time'},
        {'label':'Evening','start_time':'all_evening_start_time','end_time':'all_evening_end_time'},
      ]        
    },
    {
      'day':'Sunday',
      'label':'sunday',
      'intervals':[
        {'label':'Morning','start_time':'sunday_morning_start_time','end_time':'sunday_morning_end_time'},
        {'label':'Afternoon','start_time':'sunday_afternoon_start_time','end_time':'sunday_afternoon_end_time'},
        {'label':'Evening','start_time':'sunday_evening_start_time','end_time':'sunday_evening_end_time'},
      ]        
    },
    {
      'day':'Monday',
      'label':'monday',
      'intervals':[
        {'label':'Morning','start_time':'monday_morning_start_time','end_time':'monday_morning_end_time'},
        {'label':'Afternoon','start_time':'monday_afternoon_start_time','end_time':'monday_afternoon_end_time'},
        {'label':'Evening','start_time':'monday_evening_start_time','end_time':'monday_evening_end_time'},
      ]        
    },
    {
      'day':'Tuesday',
      'label':'tuesday',
      'intervals':[
        {'label':'Morning','start_time':'tuesday_morning_start_time','end_time':'tuesday_morning_end_time'},
        {'label':'Afternoon','start_time':'tuesday_afternoon_start_time','end_time':'tuesday_afternoon_end_time'},
        {'label':'Evening','start_time':'tuesday_evening_start_time','end_time':'tuesday_evening_end_time'},
      ]        
    },
    {
      'day':'Wednesday',
      'label':'wednesday',
      'intervals':[
        {'label':'Morning','start_time':'wednesday_morning_start_time','end_time':'wednesday_morning_end_time'},
        {'label':'Afternoon','start_time':'wednesday_afternoon_start_time','end_time':'wednesday_afternoon_end_time'},
        {'label':'Evening','start_time':'wednesday_evening_start_time','end_time':'wednesday_evening_end_time'},
      ]        
    },
    {
      'day':'Thrusday',
      'label':'thursday',
      'intervals':[
        {'label':'Morning','start_time':'thursday_morning_start_time','end_time':'thursday_morning_end_time'},
        {'label':'Afternoon','start_time':'thursday_afternoon_start_time','end_time':'thursday_afternoon_end_time'},
        {'label':'Evening','start_time':'thursday_evening_start_time','end_time':'thursday_evening_end_time'},
      ]        
    },
    {
      'day':'Friday',
      'label':'friday',
      'intervals':[
        {'label':'Morning','start_time':'friday_morning_start_time','end_time':'friday_morning_end_time'},
        {'label':'Afternoon','start_time':'friday_afternoon_start_time','end_time':'friday_afternoon_end_time'},
        {'label':'Evening','start_time':'friday_evening_start_time','end_time':'friday_evening_end_time'},
      ]        
    },
    {
      'day':'Saturday',
      'label':'saturday',
      'intervals':[
        {'label':'Morning','start_time':'saturday_morning_start_time','end_time':'saturday_morning_end_time'},
        {'label':'Afternoon','start_time':'saturday_afternoon_start_time','end_time':'saturday_afternoon_end_time'},
        {'label':'Evening','start_time':'saturday_evening_start_time','end_time':'saturday_evening_end_time'},
      ]        
    }        
  ];
   
  constructor(private _cookieservice: CookieService,
    public ds: DataService,
    public cs: CommonService,
    private fb: FormBuilder,
    public router: Router,private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService, private commonService: CommonService,
    private translate: TranslateService,) {

      this.daysSelected= []; //"2020-12-17"
      this.scheduleList= [];
      this.daysAndintrevals = [];
      this.timezone = '';    

      let apiPath = `user/get-profile`;
      this.commonService.get(apiPath).subscribe(result => {
        this.timezone = result.data.timezone;  
      }, err => {
        this.commonService.handleError(err);
      });
      this.getSchedule();      
    }  

   
  ngOnInit(): void {   
    this.frm = this.fb.group({   // Availability form      
      //dates: ['', [Validators.required]],
      all: [''],
      all_morning_start_time: [''],
      all_morning_end_time: [''],
      all_afternoon_start_time:[''],
      all_afternoon_end_time:[''],
      all_evening_start_time:[''],
      all_evening_end_time:[''],
      sunday: [''],
      sunday_morning_start_time: [''],
      sunday_morning_end_time: [''],
      sunday_afternoon_start_time: [''],
      sunday_afternoon_end_time: [''],
      sunday_evening_start_time: [''],
      sunday_evening_end_time: [''],
      monday: [''],
      monday_morning_start_time: [''],
      monday_morning_end_time: [''],
      monday_afternoon_start_time: [''],
      monday_afternoon_end_time: [''],
      monday_evening_start_time: [''],
      monday_evening_end_time: [''],
      tuesday: [''],
      tuesday_morning_start_time: [''],
      tuesday_morning_end_time: [''],
      tuesday_afternoon_start_time: [''],
      tuesday_afternoon_end_time: [''],
      tuesday_evening_start_time: [''],
      tuesday_evening_end_time: [''],
      wednesday: [''],
      wednesday_morning_start_time: [''],
      wednesday_morning_end_time: [''],
      wednesday_afternoon_start_time: [''],
      wednesday_afternoon_end_time: [''],
      wednesday_evening_start_time: [''],
      wednesday_evening_end_time: [''],
      thursday: [''],
      thursday_morning_start_time: [''],
      thursday_morning_end_time: [''],
      thursday_afternoon_start_time: [''],
      thursday_afternoon_end_time: [''],
      thursday_evening_start_time: [''],
      thursday_evening_end_time: [''],
      friday: [''],
      friday_morning_start_time: [''],
      friday_morning_end_time: [''],
      friday_afternoon_start_time: [''],
      friday_afternoon_end_time: [''],
      friday_evening_start_time: [''],
      friday_evening_end_time: [''],
      saturday: [''],
      saturday_morning_start_time: [''],
      saturday_morning_end_time: [''],
      saturday_afternoon_start_time: [''],
      saturday_afternoon_end_time: [''],
      saturday_evening_start_time: [''],
      saturday_evening_end_time: [''],      
      interval: ['15', [Validators.required]]       
    });
    // language selection code
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

  /*
  Name: createIntervals
  Description: Common function to get the intervals based on all times
  */
  createIntervals(element,interval){
    let intrevals = []; 
    for(var d = new Date(element.morning_start_time); d <= new Date(element.morning_end_time); d.setMinutes(d.getMinutes() + interval)){
      let refineTime = formatDate(new Date(d), 'HH:mm', 'en-US', '+0530');
      intrevals.push(refineTime);
     }
     for(var d = new Date(element.afternoon_start_time); d <= new Date(element.afternoon_end_time); d.setMinutes(d.getMinutes() + interval)){
      let refineTime = formatDate(new Date(d), 'HH:mm', 'en-US', '+0530');
      intrevals.push(refineTime);
     }
     for(var d = new Date(element.evening_start_time); d <= new Date(element.evening_end_time); d.setMinutes(d.getMinutes() + interval)){
      let refineTime = formatDate(new Date(d), 'HH:mm', 'en-US', '+0530');
      intrevals.push(refineTime);
     }
     return intrevals;
  }
  
  /*
  Name: getSchedule
  Description: Get already saved zoom-call schedule
  */
  getSchedule(){
    let CFUser = this._cookieservice.get('user-starsin');
    let NewCFUser = JSON.parse(CFUser);      
    let userId = NewCFUser._id;
    let path = `celebrities/get-schedule`; 
    let options = {
      celebrity_id: userId
    };   
    this.commonService.queryParams(path, options).subscribe(response => {
      if(response.data != ''){
        this.scheduleList = response.data; 
        this.daysSelected = response.data.unavailable_dates;
        
        response.data.data.forEach( (element) => { 
          let intrevals = []; 
          if(element.day == 'Sunday'){
             this.frm.controls["sunday"].setValue(true);            
             this.frm.controls["sunday_morning_start_time"].setValue(element.morning_start_time);
             this.frm.controls["sunday_morning_end_time"].setValue(element.morning_end_time); 
             this.frm.controls["sunday_afternoon_start_time"].setValue(element.afternoon_start_time);
             this.frm.controls["sunday_afternoon_end_time"].setValue(element.afternoon_end_time); 
             this.frm.controls["sunday_evening_start_time"].setValue(element.evening_start_time);
             this.frm.controls["sunday_evening_end_time"].setValue(element.evening_end_time); 
             this.daysAndintrevals.push({day:'Sunday',intervals:this.createIntervals(element,response.data.interval)});           
          } 
          if(element.day == 'Monday'){
             this.frm.controls["monday"].setValue(true);  
             this.frm.controls["monday_morning_start_time"].setValue(element.morning_start_time);
             this.frm.controls["monday_morning_end_time"].setValue(element.morning_end_time); 
             this.frm.controls["monday_afternoon_start_time"].setValue(element.afternoon_start_time);
             this.frm.controls["monday_afternoon_end_time"].setValue(element.afternoon_end_time); 
             this.frm.controls["monday_evening_start_time"].setValue(element.evening_start_time);
             this.frm.controls["monday_evening_end_time"].setValue(element.evening_end_time);            
            this.daysAndintrevals.push({day:'Monday',intervals:this.createIntervals(element,response.data.interval)});
          }
          if(element.day == 'Tuesday'){
            this.frm.controls["tuesday"].setValue(true);
            this.frm.controls["tuesday_morning_start_time"].setValue(element.morning_start_time);
            this.frm.controls["tuesday_morning_end_time"].setValue(element.morning_end_time); 
            this.frm.controls["tuesday_afternoon_start_time"].setValue(element.afternoon_start_time);
            this.frm.controls["tuesday_afternoon_end_time"].setValue(element.afternoon_end_time); 
            this.frm.controls["tuesday_evening_start_time"].setValue(element.evening_start_time);
            this.frm.controls["tuesday_evening_end_time"].setValue(element.evening_end_time);           
            this.daysAndintrevals.push({day:'Tuesday',intervals:this.createIntervals(element,response.data.interval)});
          }
          if(element.day == 'Wednesday'){
             this.frm.controls["wednesday"].setValue(true);
             this.frm.controls["wednesday_morning_start_time"].setValue(element.morning_start_time);
             this.frm.controls["wednesday_morning_end_time"].setValue(element.morning_end_time); 
             this.frm.controls["wednesday_afternoon_start_time"].setValue(element.afternoon_start_time);
             this.frm.controls["wednesday_afternoon_end_time"].setValue(element.afternoon_end_time); 
             this.frm.controls["wednesday_evening_start_time"].setValue(element.evening_start_time);
             this.frm.controls["wednesday_evening_end_time"].setValue(element.evening_end_time);
             this.daysAndintrevals.push({day:'Wednesday',intervals:this.createIntervals(element,response.data.interval)});
          }
          if(element.day == 'Thursday'){
             this.frm.controls["thursday"].setValue(true);
             this.frm.controls["thursday_morning_start_time"].setValue(element.morning_start_time);
             this.frm.controls["thursday_morning_end_time"].setValue(element.morning_end_time); 
             this.frm.controls["thursday_afternoon_start_time"].setValue(element.afternoon_start_time);
             this.frm.controls["thursday_afternoon_end_time"].setValue(element.afternoon_end_time); 
             this.frm.controls["thursday_evening_start_time"].setValue(element.evening_start_time);
             this.frm.controls["thursday_evening_end_time"].setValue(element.evening_end_time);
             this.daysAndintrevals.push({day:'Thursday',intervals:this.createIntervals(element,response.data.interval)});
          }
          if(element.day == 'Friday'){
             this.frm.controls["friday"].setValue(true);
             this.frm.controls["friday_morning_start_time"].setValue(element.morning_start_time);
             this.frm.controls["friday_morning_end_time"].setValue(element.morning_end_time); 
             this.frm.controls["friday_afternoon_start_time"].setValue(element.afternoon_start_time);
             this.frm.controls["friday_afternoon_end_time"].setValue(element.afternoon_end_time); 
             this.frm.controls["friday_evening_start_time"].setValue(element.evening_start_time);
             this.frm.controls["friday_evening_end_time"].setValue(element.evening_end_time);
             this.daysAndintrevals.push({day:'Friday',intervals:this.createIntervals(element,response.data.interval)});
          }
          if(element.day == 'Saturday'){
             this.frm.controls["saturday"].setValue(true);
             this.frm.controls["saturday_morning_start_time"].setValue(element.morning_start_time);
             this.frm.controls["saturday_morning_end_time"].setValue(element.morning_end_time); 
             this.frm.controls["saturday_afternoon_start_time"].setValue(element.afternoon_start_time);
             this.frm.controls["saturday_afternoon_end_time"].setValue(element.afternoon_end_time); 
             this.frm.controls["saturday_evening_start_time"].setValue(element.evening_start_time);
             this.frm.controls["saturday_evening_end_time"].setValue(element.evening_end_time);
             this.daysAndintrevals.push({day:'Saturday',intervals:this.createIntervals(element,response.data.interval)});
          }
                      
        });
      }      

    }, err => {
      this.commonService.handleError(err);
    }); 
  }

  /*
  Name: checkUncheckAll
  Description: When click on ALL option, checked all days with start time and end time default
  */
  checkUncheckAll(event){
    if(event.target.checked == true){      

      this.frm = this.fb.group({
        all: [true],
        all_morning_start_time: [new Date(new Date().setHours(9,0,0,0))],
        all_morning_end_time: [new Date(new Date().setHours(12,0,0,0))],
        all_afternoon_start_time:[new Date(new Date().setHours(14,0,0,0))],
        all_afternoon_end_time:[new Date(new Date().setHours(16,0,0,0))],
        all_evening_start_time:[new Date(new Date().setHours(18,0,0,0))],
        all_evening_end_time:[new Date(new Date().setHours(20,0,0,0))],      
        sunday: [true],
        sunday_morning_start_time: [new Date(new Date().setHours(9,0,0,0))],
        sunday_morning_end_time: [new Date(new Date().setHours(12,0,0,0))],
        sunday_afternoon_start_time: [new Date(new Date().setHours(14,0,0,0))],
        sunday_afternoon_end_time: [new Date(new Date().setHours(16,0,0,0))],
        sunday_evening_start_time: [new Date(new Date().setHours(18,0,0,0))],
        sunday_evening_end_time: [new Date(new Date().setHours(20,0,0,0))],       
        monday: [true],
        monday_morning_start_time: [new Date(new Date().setHours(9,0,0,0))],
        monday_morning_end_time: [new Date(new Date().setHours(12,0,0,0))],
        monday_afternoon_start_time: [new Date(new Date().setHours(14,0,0,0))],
        monday_afternoon_end_time: [new Date(new Date().setHours(16,0,0,0))],
        monday_evening_start_time: [new Date(new Date().setHours(18,0,0,0))],
        monday_evening_end_time: [new Date(new Date().setHours(20,0,0,0))],
        tuesday: [true],
        tuesday_morning_start_time: [new Date(new Date().setHours(9,0,0,0))],
        tuesday_morning_end_time: [new Date(new Date().setHours(12,0,0,0))],
        tuesday_afternoon_start_time: [new Date(new Date().setHours(14,0,0,0))],
        tuesday_afternoon_end_time: [new Date(new Date().setHours(16,0,0,0))],
        tuesday_evening_start_time: [new Date(new Date().setHours(18,0,0,0))],
        tuesday_evening_end_time: [new Date(new Date().setHours(20,0,0,0))],
        wednesday: [true],
        wednesday_morning_start_time: [new Date(new Date().setHours(9,0,0,0))],
        wednesday_morning_end_time: [new Date(new Date().setHours(12,0,0,0))],
        wednesday_afternoon_start_time: [new Date(new Date().setHours(14,0,0,0))],
        wednesday_afternoon_end_time: [new Date(new Date().setHours(16,0,0,0))],
        wednesday_evening_start_time: [new Date(new Date().setHours(18,0,0,0))],
        wednesday_evening_end_time: [new Date(new Date().setHours(20,0,0,0))],
        thursday: [true],
        thursday_morning_start_time: [new Date(new Date().setHours(9,0,0,0))],
        thursday_morning_end_time: [new Date(new Date().setHours(12,0,0,0))],
        thursday_afternoon_start_time: [new Date(new Date().setHours(14,0,0,0))],
        thursday_afternoon_end_time: [new Date(new Date().setHours(16,0,0,0))],
        thursday_evening_start_time: [new Date(new Date().setHours(18,0,0,0))],
        thursday_evening_end_time: [new Date(new Date().setHours(20,0,0,0))],
        friday: [true],
        friday_morning_start_time: [new Date(new Date().setHours(9,0,0,0))],
        friday_morning_end_time: [new Date(new Date().setHours(12,0,0,0))],
        friday_afternoon_start_time: [new Date(new Date().setHours(14,0,0,0))],
        friday_afternoon_end_time: [new Date(new Date().setHours(16,0,0,0))],
        friday_evening_start_time: [new Date(new Date().setHours(18,0,0,0))],
        friday_evening_end_time: [new Date(new Date().setHours(20,0,0,0))],
        saturday: [true],
        saturday_morning_start_time: [new Date(new Date().setHours(9,0,0,0))],
        saturday_morning_end_time: [new Date(new Date().setHours(12,0,0,0))],
        saturday_afternoon_start_time: [new Date(new Date().setHours(14,0,0,0))],
        saturday_afternoon_end_time: [new Date(new Date().setHours(16,0,0,0))],
        saturday_evening_start_time: [new Date(new Date().setHours(18,0,0,0))],
        saturday_evening_end_time: [new Date(new Date().setHours(20,0,0,0))],      
        interval: ['15', [Validators.required]]        
      });
     

    } else if(event.target.checked == false){

      this.frm = this.fb.group({   // Availability form      
        //dates: ['', [Validators.required]],
        all: [false],
        all_morning_start_time: [''],
        all_morning_end_time: [''],
        all_afternoon_start_time: [''],
        all_afternoon_end_time: [''],
        all_evening_start_time: [''],
        all_evening_end_time: [''],
        sunday: [false],
        sunday_morning_start_time: [''],
        sunday_morning_end_time: [''],
        sunday_afternoon_start_time: [''],
        sunday_afternoon_end_time: [''],
        sunday_evening_start_time: [''],
        sunday_evening_end_time: [''],
        monday: [false],
        monday_morning_start_time: [''],
        monday_morning_end_time: [''],
        monday_afternoon_start_time: [''],
        monday_afternoon_end_time: [''],
        monday_evening_start_time: [''],
        monday_evening_end_time: [''],
        tuesday: [false],
        tuesday_morning_start_time: [''],
        tuesday_morning_end_time: [''],
        tuesday_afternoon_start_time: [''],
        tuesday_afternoon_end_time: [''],
        tuesday_evening_start_time: [''],
        tuesday_evening_end_time: [''],
        wednesday: [false],
        wednesday_morning_start_time: [''],
        wednesday_morning_end_time: [''],
        wednesday_afternoon_start_time: [''],
        wednesday_afternoon_end_time: [''],
        wednesday_evening_start_time: [''],
        wednesday_evening_end_time: [''],
        thursday: [false],
        thursday_morning_start_time: [''],
        thursday_morning_end_time: [''],
        thursday_afternoon_start_time: [''],
        thursday_afternoon_end_time: [''],
        thursday_evening_start_time: [''],
        thursday_evening_end_time: [''],
        friday: [false],
        friday_morning_start_time: [''],
        friday_morning_end_time: [''],
        friday_afternoon_start_time: [''],
        friday_afternoon_end_time: [''],
        friday_evening_start_time: [''],
        friday_evening_end_time: [''],
        saturday: [false],
        saturday_morning_start_time: [''],
        saturday_morning_end_time: [''],
        saturday_afternoon_start_time: [''],
        saturday_afternoon_end_time: [''],
        saturday_evening_start_time: [''],
        saturday_evening_end_time: [''],      
        interval: ['15', [Validators.required]]       
      });

    }
    
  }

  /*
  Name: selectUnselectAll
  Description: When uncheck any one day, un-check the ALL option
  */
  selectUnselectAll(event){
    if(event.target.checked == false){
        if(this.frm.value.all == true){
          this.frm.controls["all"].setValue(false);
        }
    }
  }

  /*
  Name: startTimePickerClosed
  Description: When change the start time in ALL option, add same time to all 
  */
  startTimePickerClosed(day,interval,event){
    if(day == 'all' && interval == 'Morning'){            
      this.frm.controls["sunday_morning_start_time"].setValue(event.value);
      this.frm.controls["monday_morning_start_time"].setValue(event.value);
      this.frm.controls["tuesday_morning_start_time"].setValue(event.value);
      this.frm.controls["wednesday_morning_start_time"].setValue(event.value);
      this.frm.controls["thursday_morning_start_time"].setValue(event.value);
      this.frm.controls["friday_morning_start_time"].setValue(event.value);
      this.frm.controls["saturday_morning_start_time"].setValue(event.value);  
    }
    if(day == 'all' && interval == 'Afternoon'){            
      this.frm.controls["sunday_afternoon_start_time"].setValue(event.value);
      this.frm.controls["monday_afternoon_start_time"].setValue(event.value);
      this.frm.controls["tuesday_afternoon_start_time"].setValue(event.value);
      this.frm.controls["wednesday_afternoon_start_time"].setValue(event.value);
      this.frm.controls["thursday_afternoon_start_time"].setValue(event.value);
      this.frm.controls["friday_afternoon_start_time"].setValue(event.value);
      this.frm.controls["saturday_afternoon_start_time"].setValue(event.value);  
    } 
    if(day == 'all' && interval == 'Evening'){            
      this.frm.controls["sunday_evening_start_time"].setValue(event.value);
      this.frm.controls["monday_evening_start_time"].setValue(event.value);
      this.frm.controls["tuesday_evening_start_time"].setValue(event.value);
      this.frm.controls["wednesday_evening_start_time"].setValue(event.value);
      this.frm.controls["thursday_evening_start_time"].setValue(event.value);
      this.frm.controls["friday_evening_start_time"].setValue(event.value);
      this.frm.controls["saturday_evening_start_time"].setValue(event.value);  
    }  
  }

  /*
  Name: endTimePickerClosed
  Description: When change the end time in ALL option, add same time to all 
  */
  endTimePickerClosed(day,interval,event){
    if(day == 'all' && interval == 'Morning'){
      this.frm.controls["sunday_morning_end_time"].setValue(event.value);
      this.frm.controls["monday_morning_end_time"].setValue(event.value);
      this.frm.controls["tuesday_morning_end_time"].setValue(event.value);
      this.frm.controls["wednesday_morning_end_time"].setValue(event.value);
      this.frm.controls["thursday_morning_end_time"].setValue(event.value);
      this.frm.controls["friday_morning_end_time"].setValue(event.value);
      this.frm.controls["saturday_morning_end_time"].setValue(event.value);
    }
    if(day == 'all' && interval == 'Afternoon'){            
      this.frm.controls["sunday_afternoon_end_time"].setValue(event.value);
      this.frm.controls["monday_afternoon_end_time"].setValue(event.value);
      this.frm.controls["tuesday_afternoon_end_time"].setValue(event.value);
      this.frm.controls["wednesday_afternoon_end_time"].setValue(event.value);
      this.frm.controls["thursday_afternoon_end_time"].setValue(event.value);
      this.frm.controls["friday_afternoon_end_time"].setValue(event.value);
      this.frm.controls["saturday_afternoon_end_time"].setValue(event.value);  
    } 
    if(day == 'all' && interval == 'Evening'){            
      this.frm.controls["sunday_evening_end_time"].setValue(event.value);
      this.frm.controls["monday_evening_end_time"].setValue(event.value);
      this.frm.controls["tuesday_evening_end_time"].setValue(event.value);
      this.frm.controls["wednesday_evening_end_time"].setValue(event.value);
      this.frm.controls["thursday_evening_end_time"].setValue(event.value);
      this.frm.controls["friday_evening_end_time"].setValue(event.value);
      this.frm.controls["saturday_evening_end_time"].setValue(event.value);  
    }  
  }

  /*
  Name: save
  Description: When click on save button 
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
  Description: Add/Update schedule in DB 
  */
  add() {       
    let path = 'celebrities/add-schedule';
    let finalList = [];
    if(this.frm.value.sunday == true){
      finalList.push({
        day:'Sunday',
        morning_start_time:this.frm.value.sunday_morning_start_time,
        morning_end_time:this.frm.value.sunday_morning_end_time,
        afternoon_start_time:this.frm.value.sunday_afternoon_start_time,
        afternoon_end_time:this.frm.value.sunday_afternoon_end_time,
        evening_start_time:this.frm.value.sunday_evening_start_time,
        evening_end_time:this.frm.value.sunday_evening_end_time
      });
    }
    if(this.frm.value.monday == true){
      finalList.push({
        day:'Monday',
        morning_start_time:this.frm.value.monday_morning_start_time,
        morning_end_time:this.frm.value.monday_morning_end_time,
        afternoon_start_time:this.frm.value.monday_afternoon_start_time,
        afternoon_end_time:this.frm.value.monday_afternoon_end_time,
        evening_start_time:this.frm.value.monday_evening_start_time,
        evening_end_time:this.frm.value.monday_evening_end_time
      });
    } 
    if(this.frm.value.tuesday == true){
      finalList.push({
        day:'Tuesday',
        morning_start_time:this.frm.value.tuesday_morning_start_time,
        morning_end_time:this.frm.value.tuesday_morning_end_time,
        afternoon_start_time:this.frm.value.tuesday_afternoon_start_time,
        afternoon_end_time:this.frm.value.tuesday_afternoon_end_time,
        evening_start_time:this.frm.value.tuesday_evening_start_time,
        evening_end_time:this.frm.value.tuesday_evening_end_time
      });
    } 
    if(this.frm.value.wednesday == true){
      finalList.push({
        day:'Wednesday',
        morning_start_time:this.frm.value.wednesday_morning_start_time,
        morning_end_time:this.frm.value.wednesday_morning_end_time,
        afternoon_start_time:this.frm.value.wednesday_afternoon_start_time,
        afternoon_end_time:this.frm.value.wednesday_afternoon_end_time,
        evening_start_time:this.frm.value.wednesday_evening_start_time,
        evening_end_time:this.frm.value.wednesday_evening_end_time
      });
    } 
    if(this.frm.value.thursday == true){
      finalList.push({
        day:'Thursday',
        morning_start_time:this.frm.value.thursday_morning_start_time,
        morning_end_time:this.frm.value.thursday_morning_end_time,
        afternoon_start_time:this.frm.value.thursday_afternoon_start_time,
        afternoon_end_time:this.frm.value.thursday_afternoon_end_time,
        evening_start_time:this.frm.value.thursday_evening_start_time,
        evening_end_time:this.frm.value.thursday_evening_end_time
      });
    } 
    if(this.frm.value.friday == true){
      finalList.push({
        day:'Friday',
        morning_start_time:this.frm.value.friday_morning_start_time,
        morning_end_time:this.frm.value.friday_morning_end_time,
        afternoon_start_time:this.frm.value.friday_afternoon_start_time,
        afternoon_end_time:this.frm.value.friday_afternoon_end_time,
        evening_start_time:this.frm.value.friday_evening_start_time,
        evening_end_time:this.frm.value.friday_evening_end_time
      });
    } 
    if(this.frm.value.saturday == true){
      finalList.push({
        day:'Saturday',
        morning_start_time:this.frm.value.saturday_morning_start_time,
        morning_end_time:this.frm.value.saturday_morning_end_time,
        afternoon_start_time:this.frm.value.saturday_afternoon_start_time,
        afternoon_end_time:this.frm.value.saturday_afternoon_end_time,
        evening_start_time:this.frm.value.saturday_evening_start_time,
        evening_end_time:this.frm.value.saturday_evening_end_time
      });
    } 
    let options = { 
      unavailable_dates: this.daysSelected,
      interval: this.frm.value.interval,
      data:finalList
    };    
    this.commonService.post(path, options).subscribe(response => {
      this.toastr.success('Added successfully.');
      this.daysAndintrevals = [];
      this.getSchedule();
      this.frm.value.interval = '';
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });     
  }

  /*
  Name: isSelected
  Description: Add class to selected date in calendar
  */
  isSelected = (event: any) => {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    return this.daysSelected.find(x => x == date) ? "selected" : null;
  };

  /*
  Name: select
  Description: When select any date from calendar
  */
  select(event: any, calendar: any) {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    const index = this.daysSelected.findIndex(x => x == date);
    if (index < 0) this.daysSelected.push(date);
    // else this.daysSelected.splice(index, 1);

    calendar.updateTodaysDate();
  }

  removeDays(){
    const date = this.daysSelected
    const index = this.daysSelected.findIndex(x => x == date);
     this.daysSelected.splice(index, 1);
  }
}
