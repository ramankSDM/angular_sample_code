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
import { TranslateService,LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-webinar-schedules',
  templateUrl: './webinar-schedules.component.html',
  styleUrls: ['./webinar-schedules.component.scss']
})
export class WebinarSchedulesComponent implements OnInit {

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
    private toastr: ToastrService, private commonService: CommonService, private modalService: BsModalService,
    private translate: TranslateService) {

      this.page = 1;
      this.searchKey = '';
      this.filterStatus = '';
      this.filterParams = '';  
      this.searchDate = '';
      this.formatDate = '';
    }

  ngOnInit(): void {    
    this.getAll();   
    // language selection codes
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
  Name: getAll
  Description: Get list of all webinar added
  */
  getAll() { 
    let CFUser = this._cookieservice.get('user-starsin');
    let NewCFUser = JSON.parse(CFUser);
    let userId = NewCFUser._id;
    console.log('userId',userId)

    if(this.searchDate != ''){
      let sampleDate = this.pipe.transform(this.searchDate, 'yyyy-MM-dd');
      this.formatDate = sampleDate+'T00:00:00.000Z';      
    }
    console.log('mySimpleFormat',this.formatDate);
    
    this.spinner.show();
    let path = `celebrities/get-webinar`; 
    let options = {
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      webinar_date: this.formatDate,
      sortBy: this.sortKey,
      sort: this.sortKeyValue,
      status:this.filterStatus,
      celebrity_id:userId
    };
    this.commonService.queryParams(path, options).subscribe(response => {      
      this.dataList = response.data.data; 
      this.dataList.forEach((element) => {
        let webinar_date = element.webinar_date;       
        var today = new Date();        
        if(today > webinar_date){
          element['webinar_status'] = 'Completed';
        } else{
          element['webinar_status'] = 'New';
        }
      });

      console.log('this.dataList',this.dataList)
      this.totalRecords = response.data.total;
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
    this.getAll();
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
    this.getAll();
  }

  /*
  Name: pageChanged
  Description: when change the page from pagination,it will get new page records
  */
  pageChanged(event: any): void {
    this.page = event.page;
    this.getAll();
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
  Name: changeStatus
  Description: Change status to activate or de-activate
  */
  changeStatus(item, event) {
    this.spinner.show();
    console.log(item);
    this.spinner.hide();
    let path = `celebrity/updateWebinarStatus`;
    let json = {
      id: item._id,
      status: event
    };
    this.commonService.put(path, json).subscribe(response => {
      this.spinner.hide();
      this.toastr.success('Webinar ' + (event ? 'Activated' : 'Deactivated') + ' successfully');
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  } 

  /*
  Name: delete
  Description: Delete the Webinar
  */
  delete() {
    console.log('here',this.viewData._id);
    this.spinner.show();
    let path = `celebrity/deleteWebinar/`;
    let json = {
      id: this.viewData._id,
      webinar_id: this.viewData.webinar_id,
      isDeleted: true
    };
    this.commonService.put(path,json).subscribe(response => {
      this.modalRef1.hide();
      this.toastr.success('Webinar deleted successfully');
      this.getAll();
    }, err => {
      this.modalRef1.hide();
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  handleDateClick(arg) {
    console.log('date click! ' + arg.dateStr)
  }

  /*
  Name: closeModal3
  Description: Close the Booking View popup
  */
  closeModal3() {
    this.modalRef3.hide();
  }

}
