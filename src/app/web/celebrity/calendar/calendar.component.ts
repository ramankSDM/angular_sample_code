import { Component, OnInit, TemplateRef,ViewChild ,ElementRef } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DataService } from "../../../services/data.service";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {formatDate,DatePipe } from '@angular/common';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  
  @ViewChild("viewCalendarPop") viewCalendarPop: ElementRef;

  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3: BsModalRef;

  dataList: any;
  page: number;
  searchKey: any;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  sortKey: any = "_id";
  sortKeyValue: any = 'DESC';
  filterParams: any;
  filterStatus: any;
  requestType: any = '';
  viewData: any;
  totalRecords: any;
  searchDate : any;
  pipe = new DatePipe('en-US');
  formatDate:any;
  events: any = [];
  calendarOptions: any;
  
  selectedLang: any = 'en';
  langs: any = [];

  constructor(private _cookieservice: CookieService,
    public ds: DataService,
    public cs: CommonService,
    private fb: FormBuilder,
    public router: Router,private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService, private commonService: CommonService, private modalService: BsModalService,private translate: TranslateService) {

      this.page = 1;
      this.searchKey = '';
      this.filterStatus = '';
      this.filterParams = '';  
      this.searchDate = '';
      this.formatDate = '';
    }

  ngOnInit(): void {    
  this.getCalenderData()

  //language change code_id
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

  getCalenderData(){
    let webinarApiPath = `celebrities/getUserWebinar`; 
    let wOptions = {
      _date: '',
      requestType:this.requestType
    };

    this.commonService.queryParams(webinarApiPath, wOptions).subscribe(response => {      
      this.events = response.data.data; 
      console.log('this.userWebinarList11',this.events); 
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        eventClick: this.handleEventClick.bind(this), // bind is important!
        dateClick: this.handleDateClick.bind(this), // bind is important!
        header: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: this.events
      }       
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }



   /*
  Name: openModal2
  Description: Open popup click on View button
  */
  openModal2(template: TemplateRef<any>, data) {
    this.modalRef1 = this.modalService.show(template);
    this.viewData = data;
  }

  /*
  Name: closeModal2
  Description: Close the View popup
  */
  closeModal2() {
    this.modalRef1.hide();
  }

  
  handleDateClick(arg) {
    console.log('date click! ' + arg.dateStr)
  }

  handleEventClick(arg) {
    //alert(this.viewCalendarPop)
    console.log('event click',arg.event)     
    console.log('event click',arg.event.extendedProps.requestType)         
    this.modalRef3 = this.modalService.show(this.viewCalendarPop);
    let apiPath = `booking/get-by-id/${arg.event.id}/${arg.event.extendedProps.requestType}`;    
    this.commonService.get(apiPath).subscribe(response => {     
      console.log('this.viewData',response);  
      this.viewData = response.data; 
             
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
    this.viewData = arg.event;
  }

  filterRecords() {
    this.filterStatus = this.filterStatus;
    this.requestType = this.requestType;
    this.getCalenderData();
  }

  /*
  Name: closeModal3
  Description: Close the Booking View popup
  */
  closeModal3() {
    this.modalRef3.hide();
  }

}

