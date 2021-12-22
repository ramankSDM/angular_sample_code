import { Component, OnInit,TemplateRef } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DataService } from "../../../../services/data.service";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment'; 
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {formatDate,DatePipe } from '@angular/common';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import * as moment from 'moment';
import { tz } from 'moment-timezone';


@Component({
  selector: 'app-zoom-call',
  templateUrl: './zoom-call.component.html',
  styleUrls: ['./zoom-call.component.scss']
})
export class ZoomCallComponent implements OnInit { 
  frm: FormGroup;
  isSubmited: boolean = false;

  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  modalRef2: BsModalRef;
  selectedLang: any = 'en';
  langs: any = [];

  bookingList: any;
  page: number;
  searchKey: any;
  public activePage: number = 1;
  public rowsOnPage: number = 10;  //environment.LIMIT;
  sortKey: any = "zoom_date";
  sortKeyValue: any = 'ASC';
  filterParams: any;
  filterStatus: any;

  viewData: any;
  reject_reason: string = '';
  reject_status: string = '';
  reasornError: boolean = false;
  reasornLengthError:boolean = false;
  itemValue: any;

  minDate:any;
  maxDate:any;
  existTimeSlots:any[] = [];
  invalidDates: Array<Date>
  intrevals:any;
  calendarDataList:any;
  isConfirm:any;
  isNumber:any;
  aryIannaTimeZones: any;
  myFilter:any;
  unDates:any;
  completeRequest: any;
  selectedZone: any;
  requestStatus:any;
  requestStatusLabel:any;
  statusArray = [3,4,5];
  totalRecords: any;
  isShowForm:any;
  isShowReview:any;
  reviewData:any; 
  pendingSec:any;
  allowReschedule:any;

  constructor(private _cookieservice: CookieService,
    public ds: DataService,
    public cs: CommonService,
    private fb: FormBuilder,
    public router: Router,private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService, private commonService: CommonService, private modalService: BsModalService,private translate: TranslateService) { 

      this.intrevals = [];

      this.page = 1;
      this.searchKey = '';
      this.filterStatus = '';
      this.filterParams = '';

      this.isShowForm = true;    
      this.isShowReview = false; 

      var minDate = new Date();
      //minDate.setDate(minDate.getDate() + 2); 
      var maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      this.minDate = minDate;
      this.maxDate  = maxDate;
      this.unDates = [];

      this.completeRequest = {
        rating: 1,
      };
      this.selectedZone= { name: "Asia/Dubai (+00:00)", nameValue: "Asia/Dubai", timeValue: "+00:00", group: "Asia", abbr: "GMT" };      
    }

    ngOnInit(): void {
      this.getById();
      this.frm = this.fb.group({   // form
        celebrityId: [''],
        bookingId:[''],
        zoom_date:[''],
        zoom_time_slot:[''],        
        timezoneobject:[''],
        celeb_zoom_timezone:['']      
      });
      this.getSchedules();

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
    Name: getById
    Description: Get user full profile info
    */
    async getById() {
      let apiPath = `user/get-profile`;
      return new Promise((resolve, reject) => {
        this.commonService.get(apiPath).subscribe(async res => {         
          if(res.data.timezone){
            var timeZoneArr = res.data.timezone.split('/');
            this.selectedZone = { name: res.data.timezone+" (+00:00)", nameValue: res.data.timezone, timeValue: "+00:00", group: timeZoneArr[0], abbr: "GMT" };
          }
        },
          (err) => {
            this.commonService.loading(false)
            this.commonService.handleError(err);
          }
        );
      });
    }

    /*
    Name: onRate
    Description: Rate to the booking
    */
    onRate(event) {
      this.completeRequest.rating = event.newValue;
    }
    
    /*
    Name: getSchedules
    Description: Get list of zoom-call schedules
    */
    getSchedules() {
      this.spinner.show();
      let path = `booking/get-fan-celebrity-zoom-bookings`;    
  
      let options = {
        page: this.activePage,
        count: this.rowsOnPage,
        search: this.searchKey,
        sortBy: this.sortKey,
        sort: this.sortKeyValue,
        status:this.filterStatus
      };
      console.log("timezoneee ", moment().tz("Europe/London"));
      this.commonService.queryParams(path, options).subscribe(response => {
        this.bookingList = response.data.data;
        this.totalRecords = response.data.total;
        console.log('this.bookingList',this.bookingList);
        this.bookingList.forEach((element) => {
          let zoom = element.zoom_date;
          let pipe = new DatePipe('en-US');      
          var myShortFormat = pipe.transform(zoom, 'fullDate');

          let zoom_time_slot = element.zoom_time_slot;
          var timeArr = zoom_time_slot.split(' '); 

          var zoomDateTime = myShortFormat+' '+timeArr[0]+':00 GMT+0530 (India Standard Time)';
          var dateSent = new Date(zoomDateTime);
		  console.log("dateSent ", dateSent)
          var currentDate = new Date();
          var hourDiff = 0;
          if(dateSent > currentDate){
            var hourDiff = Math.abs(currentDate.getTime() - dateSent.getTime()) / 3600000;
          }         
          //element['pendingHours'] = Math.round(Math.abs(hourDiff));          
          var numb = Math.abs(hourDiff);
          element['pendingHours'] = numb.toFixed(2);
		  
		  
		  let  zoomNewDateTime = myShortFormat+' '+timeArr[0]+':00';
		   //var dateNewSent = new Date(zoomNewDateTime);
		   let dateNewSent =  moment(zoomNewDateTime);
		   console.log("dateNewSent ", dateNewSent);
		   let currentNDate =  moment().tz(element.zoom_timezone);
		   console.log("currentNDate ", currentNDate);
		  //let pendingSec = currentNDate.diff(dateNewSent, 'seconds');
		  //console.log("pendingSec ", pendingSec) 
		  
		  this.pendingSec = dateNewSent.diff(currentNDate, 'seconds');
		  console.log("pendingSec ", this.pendingSec) 
		  
		  this.allowReschedule = dateNewSent.diff(currentNDate, 'hours');
		  console.log("allowReschedule ", this.allowReschedule) 
		  
		  
        });  
			console.log("bookingList new ", this.bookingList);
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      });
    }
    
    /*
    Name: filterRecords
    Description: Filter the records based on status and fetch updated records
    */
    filterRecords() {
      if (this.filterStatus == 'activated') {
        this.filterParams = true;
      } else if (this.filterStatus == 'deactivated') {
        this.filterParams = false;
      } else {
        this.filterParams = '';
      }
      this.getSchedules();
    }
    
    /*
    Name: sortBy
    Description: Sort the results based on key
    */
    sortBy(key) {
      this.sortKey = key;
      if (this.sortKeyValue === 'DESC') {
        this.sortKeyValue = 'ASC';
      } else {
        this.sortKeyValue = 'DESC';
      }
      this.getSchedules();
    }
    
    /*
    Name: pageChanged
    Description: when change the page from pagination,it will get new page records
    */
    pageChanged(event: any): void {
      this.activePage = event.page;
      this.getSchedules();
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
    
    /*
    Name: closeModal
    Description: Close the Reject popup
    */
    closeModal() {
      this.modalRef.hide();
    }
    
    /*
    Name: reject
    Description: Reject the request with reason
    */
    reject() {
      if (this.reject_reason == '') {
        this.reasornError = true;
        return false;
      } else if(this.reject_reason.length < 50){
        this.reasornLengthError = true;
        return false;
      }else {
        this.reject_reason = this.reject_reason;
        this.modalRef.hide();
        if(this.reject_status == '8'){
          this.updateRefundStatus(this.itemValue, this.reject_status)
        } else{
          this.updateStatus(this.itemValue, this.reject_status)
        }
      }
    }
    
    updateRefundStatus(item, status){
      this.spinner.show();
      let path = `refund/addRefund`;
      let json = {
        bookingId: item._id,
        refundReason: this.reject_reason
      };
      this.commonService.post(path, json).subscribe(response => {
        console.log(response);
        this.reject_reason = '';
        this.toastr.success('Refund Request sent successfully');    
        this.getSchedules();
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      });
    }

    /*
    Name: updateStatus
    Description: Update request status
    */
    updateStatus(item, status) {
      this.spinner.show();
      let path = `booking/updateStatus`;
      let json = {
        requestId: item._id,
        status: status,
        reason: this.reject_reason
      };
      this.commonService.put(path, json).subscribe(response => {
        if (status == 2) {
          this.toastr.success('Request accepted successfully');
          this.modalRef1.hide();
        } else if (status == 4) {
          this.reject_reason = '';
          this.toastr.success('Request cancelled successfully');
        }  else if (status == 8) {
          this.reject_reason = '';
          this.toastr.success('Refund Request sent successfully');
        }      
        this.getSchedules();
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      });
    }

    /*
    Name: openModal
    Description: Open popup click on Reject button
    */
    openModal(template: TemplateRef<any>, data, status) {      
      this.reject_reason = '';
      this.modalRef = this.modalService.show(template);
      this.itemValue = data;
      this.reject_status = status;
      this.requestStatusLabel = 'cancel';
      if(status == 8){
        this.requestStatusLabel = 'refund';
      }      
    }

    /*
    Name: reschedule
    Description: Reschedule the booking if celebrity rejects 
    */
    reschedule(template: TemplateRef<any>, data){
      this.intrevals = [];
      this.modalRef = this.modalService.show(template);
      this.itemValue = data;
      this.frm.controls["celebrityId"].setValue(this.itemValue.celebrityId);
      this.frm.controls["bookingId"].setValue(this.itemValue._id);
      var timeZoneArr = this.itemValue.zoom_timezone.split('/');
      this.selectedZone = { name: this.itemValue.zoom_timezone+" (+00:00)", nameValue: this.itemValue.zoom_timezone, timeValue: "+00:00", group: timeZoneArr[0], abbr: "GMT" };
      this.frm.controls["celeb_zoom_timezone"].setValue(this.itemValue.zoom_timezone);
      
      let path = `celebrities/get-schedule`;
      let options = {
        celebrity_id: this.itemValue.celebrityId
      };   
      this.commonService.queryParams(path, options).subscribe(response => {
        this.calendarDataList = response.data; 
      }, err => {
        this.commonService.handleError(err);
      });
    }

     /*
    Name: dateChanged
    Description: When date changed from calendar
    */
    dateChanged(date) {    
      this.frm.controls["zoom_date"].setValue(date);
      this.getIntervals(date,this.frm.value.timezoneobject.nameValue);
    }

    /*
    Name: showConfirmButtom
    Description: To show the confirm button on form
    */
    showConfirmButtom(item,i){ 
      this.frm.controls["zoom_time_slot"].setValue(item);  
      this.isNumber = i;
      this.isConfirm = true;
    }

  /*
  Name: showReview
  Description: Show Review form after fill all info
  */
  showReview(item){       
    this.isShowForm = false;
    this.isShowReview = true;
    this.reviewData = item;
    console.log('this.reviewData',item)
  }

  /*
    Name: back
    Description: Back from Review
    */
  back(){
    this.isShowForm = true;
    this.isShowReview = false;
  }
  /*
  Name: updateBooking
  Description: Update booking request
  */
  updateBooking(){
      this.spinner.show();
      let zoom = this.frm.value.zoom_date;
      let item = this.frm.value.zoom_time_slot;

      let pipe = new DatePipe('en-US');      
      var myShortFormat = pipe.transform(zoom, 'fullDate');
      var timeArr = item.split(' ');
      var zoomDateTime = myShortFormat+' '+timeArr[0]+':00 GMT+0530 (India Standard Time)';

      let timeSlotPath = `booking/check-time-slots`;
      let options = {
        userId: this.frm.value.celebrityId,
        zoomBookingDateTime: zoomDateTime
      };   
      this.commonService.queryParams(timeSlotPath, options).subscribe(response => {      
        if(response.data == false){
          this.toastr.error(response.message);     
        } else{
          let path = `booking/updateBooking`; 
          let json = {
            booking_id: this.frm.value.bookingId,
            zoom_date: this.frm.value.zoom_date,
            zoom_time_slot: this.frm.value.zoom_time_slot,
            zoomBookingDateTime: zoomDateTime,
            zoom_timezone:this.frm.value.timezoneobject.nameValue,
            status:1
          };
          this.commonService.post(path, json).subscribe(response => {
            this.toastr.success('Booking updated successfully');
            this.spinner.hide();
            this.modalRef.hide();
            this.getSchedules();
          }, err => {
            this.spinner.hide();
            this.commonService.handleError(err);
          });
        } 
             
      }, err => {
        this.commonService.handleError(err);
      }); 
      return;      
    }

    refund(item){
      this.toastr.success('Refunded successfully');
    }

    getCurrentTime(event : any){       
      this.getIntervals(this.frm.value.zoom_date,this.frm.value.timezoneobject.nameValue);  
    }
    
    /*
    Name: getIntervals
    Description: Find intervals from start time and end time
    */
    getIntervals(date,timezone){
      if(date != ''){
        let path = 'booking/get-time-slots';
        let options = { 
          celebrityId: this.frm.value.celebrityId,
          zoom_date: date,
          requestType:4
        }; 
        this.commonService.queryParams(path, options).subscribe(response => {
            this.existTimeSlots = response.data;
            var weekday = [];
            weekday[0] =  "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            let selectedDay = weekday[new Date(date).getDay()];    
            
            let day = ("0" + date.getDate()).slice(-2); // adjust 0 before single digit date    
            let month = ("0" + (date.getMonth() + 1)).slice(-2); // current month    
            let year = date.getFullYear();  // current year   
            let selectedDate = year + "-" + month + "-" + day; // prints date in YYYY-MM-DD format           
            
            this.intrevals = [];
            if(!this.calendarDataList.unavailable_dates.includes(selectedDate)){
              this.calendarDataList.data.forEach( (element) => {
                  if(element.day == selectedDay){
                    if(timezone == this.frm.value.celeb_zoom_timezone){ //on load or same timezone with star                    
                      for(var d = new Date(element.morning_start_time); d <= new Date(element.morning_end_time); d.setMinutes(d.getMinutes() + this.calendarDataList.interval)){
                        let refineTime = formatDate(new Date(d), 'hh:mm a', 'en-US', '+0530');
                        if(!this.existTimeSlots.includes(refineTime)){
                          this.intrevals.push(refineTime);
                        }                                       
                      }
                      for(var d = new Date(element.afternoon_start_time); d <= new Date(element.afternoon_end_time); d.setMinutes(d.getMinutes() + this.calendarDataList.interval)){
                        let refineTime = formatDate(new Date(d), 'hh:mm a', 'en-US', '+0530');
                        if(!this.existTimeSlots.includes(refineTime)){
                          this.intrevals.push(refineTime);
                        }                                       
                      }
                      for(var d = new Date(element.evening_start_time); d <= new Date(element.evening_end_time); d.setMinutes(d.getMinutes() + this.calendarDataList.interval)){
                        let refineTime = formatDate(new Date(d), 'hh:mm a', 'en-US', '+0530');
                        if(!this.existTimeSlots.includes(refineTime)){
                          this.intrevals.push(refineTime);
                        }                                       
                      }

                    } else{ //if fan chooses different timezone
                        /* Morning intervals */
                        let morningDate = new Date(element.morning_start_time);                       
                        let newMorningStartTime = morningDate.toLocaleString("en-US", {
                          timeZone: `${timezone}`
                        });
                        
                        let morningEndDate = new Date(element.morning_end_time);                       
                        let newMorningEndTime = morningEndDate.toLocaleString("en-US", {
                          timeZone: `${timezone}`
                        });
                        for(var d = new Date(newMorningStartTime); d <= new Date(newMorningEndTime); d.setMinutes(d.getMinutes() + this.calendarDataList.interval)){
                          let refineTime = formatDate(new Date(d), 'hh:mm a', 'en-US', '+0530');                      
                          if(!this.existTimeSlots.includes(refineTime)){
                            this.intrevals.push(refineTime);
                          }                                       
                        }
                        /* Afternoon intervals */
                        let afternoonDate = new Date(element.afternoon_start_time);                       
                        let newAfternoonStartTime = afternoonDate.toLocaleString("en-US", {
                          timeZone: `${timezone}`
                        });
                        
                        let afternoonEndDate = new Date(element.afternoon_end_time);                       
                        let newAfternoonEndTime = afternoonEndDate.toLocaleString("en-US", {
                          timeZone: `${timezone}`
                        });
                        for(var d = new Date(newAfternoonStartTime); d <= new Date(newAfternoonEndTime); d.setMinutes(d.getMinutes() + this.calendarDataList.interval)){
                          let refineTime = formatDate(new Date(d), 'hh:mm a', 'en-US', '+0530');                      
                          if(!this.existTimeSlots.includes(refineTime)){
                            this.intrevals.push(refineTime);
                          }                                       
                        }

                        /* Evening intervals */
                        let eveningDate = new Date(element.evening_start_time);                       
                        let newEveningStartTime = eveningDate.toLocaleString("en-US", {
                          timeZone: `${timezone}`
                        });
                        
                        let eveningEndDate = new Date(element.evening_end_time);                       
                        let newEveningEndTime = eveningEndDate.toLocaleString("en-US", {
                          timeZone: `${timezone}`
                        });
                        for(var d = new Date(newEveningStartTime); d <= new Date(newEveningEndTime); d.setMinutes(d.getMinutes() + this.calendarDataList.interval)){
                          let refineTime = formatDate(new Date(d), 'hh:mm a', 'en-US', '+0530');                      
                          if(!this.existTimeSlots.includes(refineTime)){
                            this.intrevals.push(refineTime);
                          }                                       
                        }
                     
                    }
                  }
              });
            }
        }, err => {
          this.spinner.hide();
          this.commonService.handleError(err);
        }); 
      }
    }

    onNavigate(link){
      window.open(link, "_blank");
  }
}
