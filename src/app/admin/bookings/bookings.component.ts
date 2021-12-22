import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { Track } from 'ngx-audio-player';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3: BsModalRef;
  postponeDays: any;
  postponeError: boolean = false;
  dataList: any;
  title: any;
  itemValue: any;
  viewData: any;
  totalRecords: any;
  page: number;
  searchKey: any;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  sortKey: any = "";
  

  sortKeyValue: any = 'DESC';
  filterParams: any;
  filterStatus: any;
  requestType: any = '';
  reject_reason: string = '';
  mail_message: string = '';
  mail_subject: string = '';
  reasornError: boolean = false;
  expiryDate: any;
  finalList: any;
  mailArray: any = [];
  isCheckedAll: boolean = false;
  masterSelected: boolean = false;
  checkedList: any;
  sendMailTo: string = '';
  sub: any;
  type: '';
  loggedInAdmin: any;
  msaapDisplayTitle = true;
  msaapDisplayPlayList = true;
  msaapPageSizeOptions = [2, 4, 6];
  msaapDisplayVolumeControls = true;
  msaapDisablePositionSlider = true;
  pageSizeOptions = [2, 4, 6];
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


  isBookingTab: boolean = false;

  constructor(private _cookieservice: CookieService, private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService, private route: ActivatedRoute
  ) {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.postponeDays = '';
    this.finalList = [];
    this.loggedInAdmin = JSON.parse(this._cookieservice.get('starin-admin'));
    if (this.loggedInAdmin) {
      if (this.loggedInAdmin.role == 1) {
        this.isBookingTab = true;
      } else {
        for (let i = 0; i < this.loggedInAdmin.permissionData.length; i++) {
          if (this.loggedInAdmin.permissionData[i].permissionId.name == 'Booking Management') {
            this.isBookingTab = true;
          }
        }
      }

    }
  }

  ngOnInit() {
    if (this.isBookingTab == false) {
      this.toastr.error('You are not authorized.')
      this.router.navigate(['/admin/profile'])
    }
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        console.log('params', params);
        this.filterStatus = params.status || '';
        this.requestType = params.type || '';
      });
    this.getAll();
  }

  /*
  Name: getAll
  Description: Get list of all Bookings.
  */
  getAll() {
    this.spinner.show();
    let path = `booking/get-all`;
    let options = {
      type: this.requestType,
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      status: this.filterStatus,
      sortBy: this.sortKey,
      sort: this.sortKeyValue
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.dataList = response.data.data;
      this.totalRecords = response.data.total;
      this.dataList.forEach((element) => {
        var date = new Date(element.bookingDateTime);
        date.setDate(date.getDate() + 7);
        element['expiryDate'] = date;
        element['isSelected'] = false;
      });
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  searchByName(){
    this.activePage = 1;
    this.rowsOnPage = environment.LIMIT;
  }
  /*
  Name: filterRecords
  Description: Filter the records based on status and fetch updated records
  */
  filterRecords() {
    this.activePage = 1;
    this.rowsOnPage = environment.LIMIT;
    this.filterStatus = this.filterStatus;
    this.requestType = this.requestType;
    this.getAll();
  }

  onEnded(event) {
  }

  /*
  Name: updateStatus
  Description: Update status of booking
  */
  updateStatus(item, status) {
    this.spinner.show();
    let path = `booking/updateStatus`;
    let json = {
      requestId: item._id,
      status: status,
      reason: this.reject_reason,
      postponeDay: this.postponeDays
    };
    this.commonService.put(path, json).subscribe(response => {
      if (status == 2) {
        this.toastr.success('Request accepted successfully');
      } else if (status == 3) {
        this.reject_reason = '';
        this.toastr.success('Request rejected successfully');
      } else if (status == 6) {
        this.postponeDays = '';
        this.toastr.success('Request postpone successfully');
      }
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: changeStatus
  Description: Change status of Booking activated and de-activated
  */
  changeStatus(item, event) {
    this.spinner.show();
    let path = `user/updateStatus`;
    let json = {
      id: item._id,
      status: event
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Celebrities ' + (event ? 'Activated' : 'Deactivated') + ' successfully');
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: reject
  Description: Reject the request with reason and update status
  */
  reject() {
    if (this.reject_reason == '') {
      this.reasornError = true;
    } else {
      this.reject_reason = this.reject_reason;
      this.modalRef.hide();
      this.updateStatus(this.itemValue, 3)
    }
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
 Description: Delete the booking
 */
  delete() {
    this.spinner.show();
    this.modalRef.hide();
    let path = `user/delete/` + this.itemValue._id;
    this.commonService.delete(path).subscribe(response => {
      this.toastr.success('Celebrities deleted successfully');
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
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
    this.modalRef = this.modalService.show(template);
    this.itemValue = data;
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

  /*
  Name: closeModal2
  Description: Close the View popup
  */
  closeModal2() {
    this.modalRef1.hide();
  }

  /*
  Name: openModal3
  Description: Open popup click on Postpone button
  */
  openModal3(template: TemplateRef<any>, data) {
    this.modalRef2 = this.modalService.show(template);
    this.viewData = data;
  }

  /*
  Name: closeModal3
  Description: Close the Postpone popup
  */
  closeModal3() {
    this.modalRef2.hide();
  }

  /*
  Name: openModal4
  Description: Open popup click on Send Email button
  */
  openModal4(template: TemplateRef<any>, status) {
    this.modalRef3 = this.modalService.show(template);
    this.sendMailTo = status;
  }

  /*
  Name: closeModal4
  Description: Close the Send Email popup
  */
  closeModal4() {
    this.modalRef3.hide();
  }

  /*
  Name: postponeSubmit
  Description: Submit the Postpone request
  */
  postponeSubmit() {
    if (this.postponeDays == '') {
      this.postponeError == true;
      return false;
    } else {
      this.postponeDays = this.postponeDays;
      this.modalRef2.hide();
      this.updateStatus(this.viewData, 6)
    }
  }

  /*
  Name: isAllSelected
  Description: Checked ALL option based on items
  */
  isAllSelected() {
    this.masterSelected = this.dataList.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  /*
  Name: checkUncheckAll
  Description: Check Uncheck all items based on ALL option
  */
  checkUncheckAll() {
    for (var i = 0; i < this.dataList.length; i++) {
      this.dataList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  /*
  Name: getCheckedItemList
  Description: Get list of all checked items
  */
  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.dataList.length; i++) {
      if (this.dataList[i].isSelected)
        this.checkedList.push(this.dataList[i]);
    }
    this.checkedList = this.checkedList;
  }

  /*
  Name: sendMail
  Description: Send Email to Fans/Celebrities
  */
  sendMail() {
    this.spinner.show();
    if (this.sendMailTo == 'fan') {
      this.checkedList.forEach((element) => {
        this.mailArray.push(element.senderData.email)
      })
    }
    if (this.sendMailTo == 'celebrity') {
      this.checkedList.forEach((element) => {
        this.mailArray.push(element.receiverData.email)
      })
    }
    let path = `booking/sendMailToUsers/`;
    let json = {
      emails: this.mailArray,
      message: this.mail_message,
      subject: this.mail_subject
    }
    this.commonService.post(path, json).subscribe(response => {
      this.spinner.hide();
      this.getAll();
      this.checkedList = [];
      this.mailArray = [];
      this.closeModal4();
      this.toastr.success('Mail sent successfully');
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
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
  Name: download Csv
  Description: download csv with filters
  */
  downloadReport() {
    this.spinner.show();
    let path = `downloads/booking`;
    let options = {
      type: this.requestType,
      search: this.searchKey,
      status: this.filterStatus
    };
    console.log('path',path);
    this.commonService.queryParams(path, options).subscribe(response => {
      let finalFile = environment.backendURL+response.data;
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', finalFile);
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

}
