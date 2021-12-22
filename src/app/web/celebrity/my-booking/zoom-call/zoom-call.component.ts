import { Component, OnInit, TemplateRef } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DataService } from "../../../../services/data.service";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {formatDate,DatePipe } from '@angular/common';
import { parseHostBindings } from '@angular/compiler';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-zoom-call',
  templateUrl: './zoom-call.component.html',
  styleUrls: ['./zoom-call.component.scss']
})
export class ZoomCallComponent implements OnInit {

  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  modalRef2: BsModalRef;
  selectedLang: any = 'en';
  langs: any = [];
  bookingList: any;
  page: number;
  searchKey: any;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  sortKey: any = "_id";
  sortKeyValue: any = 'DESC';
  filterParams: any;
  filterStatus: any;
  viewData: any;
  reject_reason: string = '';
  reasornError: boolean = false;
  itemValue: any;
  completeRequest: any; 

  constructor(private _cookieservice: CookieService,
    public ds: DataService,
    public cs: CommonService,
    private fb: FormBuilder,
    public router: Router,private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService, private commonService: CommonService, private modalService: BsModalService, private translate: TranslateService) {

      this.page = 1;
      this.searchKey = '';
      this.filterStatus = '';
      this.filterParams = '';
      this.completeRequest = {
        comment: '',
        rating: 1,
      };

     }

  ngOnInit(): void {    
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
  Name: onRate
  Description: Rate to the booking
  */
  onRate(event) {
    this.completeRequest.rating = event.newValue;
  }

  /*
  Name: getSchedules
  Description: Get list of all schedule zoom-call meetings
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
    this.commonService.queryParams(path, options).subscribe(response => {
      this.bookingList = response.data.data;  
      console.log('this.bookingList',this.bookingList)   
      this.bookingList.forEach((element) => {
        let zoom = element.zoom_date;
        let pipe = new DatePipe('en-US');      
        var myShortFormat = pipe.transform(zoom, 'fullDate');

        let zoom_time_slot = element.zoom_time_slot;
        var timeArr = zoom_time_slot.split(' '); 

        var zoomDateTime = myShortFormat+' '+timeArr[0]+':00 GMT+0530 (India Standard Time)';
        var dateSent = new Date(zoomDateTime);
        var currentDate = new Date();
        var hourDiff = 0;
        if(dateSent > currentDate){
          var hourDiff = Math.abs(currentDate.getTime() - dateSent.getTime()) / 3600000;
        }       
        var numb = Math.abs(hourDiff);
        element['pendingHours'] = numb.toFixed(2);
      });               
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
    this.page = event.page;
    this.getSchedules();
  }

   /*
  Name: openModal2
  Description: Open popup click on View button
  */
  openModal2(template: TemplateRef<any>, data) {
    this.modalRef1 = this.modalService.show(template);
    this.viewData = data;    
    this.getSchedules();
    // if (this.viewData.status == 1) {
    //   let path = `booking/updateStatus`;
    //   let json = {
    //     requestId: this.viewData._id,
    //     status: 7
    //   };
    //   this.commonService.put(path, json).subscribe(response => {
    //     this.getSchedules();
    //   }, err => {
    //     this.commonService.handleError(err);
    //   });
    // }
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
  Description: when rejects the request with reason
  */
  reject() {
    if (this.reject_reason == '') {
      this.reasornError = true;
      return false;
    } else {
      this.reject_reason = this.reject_reason;
      this.modalRef.hide();
      this.updateStatus(this.itemValue, 3)
    }
  }

  /*
  Name: updateStatus
  Description: Update status of Request
  */
  updateStatus(item, status) {
    this.spinner.show();
    let path = `booking/updateStatus`;
    let json = {
      requestId: item._id,
      booking_id:item._id,
      zoomBookingDateTime:item.zoomBookingDateTime,
      zoom_occasion:item.zoom_occasion,
      zoom_timezone:item.zoom_timezone,
      status: status,
      reason: this.reject_reason,
      postponeDay: 0,
      requestType: 4
    };
    this.commonService.put(path, json).subscribe(response => {
      if (status == 2) {
        this.toastr.success('Request accepted successfully');
        this.modalRef1.hide();
      } else if (status == 3) {
        this.reject_reason = '';
        this.toastr.success('Request rejected successfully');
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
    this.modalRef = this.modalService.show(template);
    this.itemValue = data;
    this.completeRequest = {
      comment: '',
      rating: 1,
    };
  }

  /*
  Name: launchMeeting
  Description: when click on launch meeting, this buttom will enable before 15 minutes of the meeting
  */
  launchMeeting(item){
    this.spinner.show();
    let path = `booking/get-zoom-start-url`;    
    let options = {
      meetingId: item.zoom_meeting_id     
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      window.open(response.data, "_blank");
      this.modalRef1.hide();
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  complete() {
    this.spinner.show();
    this.completeRequest.requestId = this.itemValue._id;
    let path = `booking/completeBooking`;
    this.commonService.put(path, this.completeRequest).subscribe(response => {
      this.toastr.success('Request Completed successfully');
      this.spinner.hide();
      this.modalRef.hide();
      this.getSchedules();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

}
