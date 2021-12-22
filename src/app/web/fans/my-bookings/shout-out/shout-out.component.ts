import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { Track } from 'ngx-audio-player';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-shout-out',
  templateUrl: './shout-out.component.html',
  styleUrls: ['./shout-out.component.scss']
})
export class ShoutOutComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  selectedLang: any = 'en';
  langs: any = [];
  dataList: any;
  title: any;
  itemValue: any;
  viewData: any;
  totalRecords: any;
  page: number;
  searchKey: any;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  sortKey: any = "_id";
  sortKeyValue: any = 'DESC';
  filterParams: any;
  filterStatus: any;
  requestType: number = 1;
  isFanCancel: any;
  msaapDisplayTitle = true;
  msaapDisplayPlayList = true;
  msaapPageSizeOptions = [2, 4, 6];
  msaapDisplayVolumeControls = true;
  msaapDisablePositionSlider = true;
  pageSizeOptions = [2, 4, 6];
  completeRequest: any;
  statusArray = [3,4,5];
  reject_reason: string = '';
  reject_status: string = '';
  reasornError: boolean = false;
  msaapPlaylist: Track[] = [
    {
      title: 'Audio One Title',
      link: 'https://geekanddummy.com/wp-content/uploads/2014/02/ambient-noise-server-room.mp3'
    }
  ];

  customOptions: OwlOptions = {
    nav: true,
    navText: ['<div class="prev-left"></div>', '<div class="nxt-right></div>"'],
    loop: false,
    autoplay: false,
    center: false,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  }
  headerOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  }
  constructor(private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService,private translate: TranslateService, public ds: DataService
  ) {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.completeRequest = {
      comment: '',
      rating: 1
    };
  }

  ngOnInit() {
    

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
    this.isFanCancel = 'false';
    this.getAll();
    
  }

  /*
  Name: getAll
  Description: Get list of all type of bookings requests
  */
  getAll() {
    this.spinner.show();
    let path = `booking/get-all`;
    let options = {
      type: this.requestType,
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      status: this.filterStatus
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.dataList = response.data.data;
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
    this.filterStatus = this.filterStatus;
    this.getAll();
  }

  /*
  Name: changeStatus
  Description: Change status to activate or de-activate
  */
  changeStatus(item, event) {
    this.spinner.show();
    let path = `category/updateStatus`;
    let json = {
      id: item._id,
      status: event
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Category ' + (event ? 'Activated' : 'Deactivated') + ' successfully');
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: pageChanged
  Description: when change the page from pagination,it will get new page records
  */
  pageChanged(event: any): void {
    this.activePage = event.page;
    this.getAll();
  }

  /*
  Name: delete
  Description: Deletes the request
  */
  delete() {
    this.spinner.show();
    this.modalRef.hide();
    let path = `category/delete/` + this.itemValue._id;
    this.commonService.delete(path).subscribe(response => {
      this.toastr.success('Category deleted successfully');
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  copyUrl(val: any){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
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
  Name: closeModal
  Description: Close the Reject popup
  */
  closeModal() {
    this.modalRef.hide();
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
  }

  /*
  Name: openModal2
  Description: Open popup click on View button
  */
  openModal2(template: TemplateRef<any>, data) {
    this.modalRef1 = this.modalService.show(template);
    this.viewData = data;
    if (this.viewData.talentType == 'mp3') {
      this.msaapPlaylist = [
        {
          title: 'Audio Request',
          link: this.viewData.talentMp3
        }
      ]
    }
  }

  onEnded(event) {

  }

  /*
  Name: closeModal2
  Description: Close the View popup
  */
  closeModal2() {
    this.modalRef1.hide();
  }

  /*
  Name: cancelRequest
  Description: Cancelled the request
  */
  cancelRequest(item) {
    this.spinner.show();
    let path = `booking/updateStatus`;
    let json = {
      requestId: item._id,
      status: 4
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Cancelled successfully');
      this.spinner.hide();
      this.modalRef.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
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
  Name: fanRating
  Description: Give Rating to the booking
  */
  fanRating() {
      this.spinner.show();
      this.completeRequest.requestId = this.itemValue._id;
      let path = `booking/fanRating`;
      this.commonService.put(path, this.completeRequest).subscribe(response => {
        this.toastr.success('Rating done successfully');
        this.completeRequest = {
          comment: '',
          rating: 1
        };
        this.spinner.hide();
        this.modalRef.hide();
        this.getAll();
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      });
  }

  /*
    Name: reject
    Description: Reject the request with reason
    */
   reject() {
    if (this.reject_reason == '') {
      this.reasornError = true;
      return false;
    } else {
      this.reject_reason = this.reject_reason;
      this.modalRef.hide();      
      this.updateRefundStatus(this.itemValue, this.reject_status)      
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
      this.reject_reason = '';
      this.toastr.success('Refund Request sent successfully');  
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  publishMessage(id, status, type) {
    this.spinner.show();
    let path = `booking/update-dm-status`;
    let options = {
      booking_id: id,
      isPublic : Boolean = status,
      requestType : type

    };
    this.commonService.put(path, options).subscribe(response => {
      if (status == true) {
        this.toastr.success('Successfully Un-Published');
      } else {
        this.toastr.success('Successfully Published');
      }
      this.getAll();
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

}
