import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { Track } from 'ngx-audio-player';
import {media} from "../../../shared/_json_files/constant"

@Component({
  selector: 'app-got-talent',
  templateUrl: './got-talent.component.html',
  styleUrls: ['./got-talent.component.scss']
})
export class GotTalentComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  modalRef2: BsModalRef;
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
  sortKey: any = "_id";
  sortKeyValue: any = 'DESC';
  filterParams: any;
  filterStatus: any;
  requestType: number = 2;
  reject_reason: string = '';
  reasornError: boolean = false;
  completeRequest: any;
  videoFile = media.video
  // msaapDisplayTitle = true;
  // msaapDisplayPlayList = true;
  // msaapPageSizeOptions = [2, 4, 6];
  // msaapDisplayVolumeControls = true;
  // msaapDisablePositionSlider = true;
  // pageSizeOptions = [2, 4, 6];
  // msaapPlaylist: Track[] = [
  //   {
  //     title: 'Audio One Title',
  //     link: 'https://geekanddummy.com/wp-content/uploads/2014/02/ambient-noise-server-room.mp3'
  //   }
  // ];
  constructor(private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService
  ) {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.postponeDays = '';
    this.completeRequest = {
      comment: '',
      rating: 1,
      video: ''
    };

  }

  ngOnInit() {
    this.getAll();
    console.log(this.videoFile)
  }

  onEnded(event) {
    
  }

  /*
  Name: getAll
  Description: Get list of all i-got talent bookings
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
  Name: updateStatus
  Description: Update status of Request
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
  Name: reject
  Description: when rejects the request with reason
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
  Name: delete
  Description: delete the request
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
    let path = `booking/updateStatus`;
    let json = {
      requestId: this.viewData._id,
      status: 7
    };
    this.commonService.put(path, json).subscribe(response => {
      this.getAll();
    }, err => {
      this.commonService.handleError(err);
    });
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
  Name: postponeSubmit
  Description: Submit from the postpone form
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
  Name: onVideoUpload
  Description: Upload video
  */
  onVideoUpload(event) {
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size > this.videoFile) {
        this.toastr.error("Too large image, Please upload profile image of size 5mb or less.");
        return false;
      } else {
        const video = event.target.files[0];
        this.spinner.show();
        const formData: FormData = new FormData();
        formData.append('video', video);
        let apiPath = `common/videoUpload`;
        this.commonService.post(apiPath, formData).subscribe(result => {
          const location = environment.backendURL + 'uploads/' + result.data;
          this.completeRequest.video = location;
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.commonService.handleError(err);
        });

      }
    }
  }

  /*
  Name: complete
  Description: Complete the booking
  */
  complete() {
    this.spinner.show();
    this.completeRequest.requestId = this.itemValue._id;
    let path = `booking/completeBooking`;
    this.commonService.put(path, this.completeRequest).subscribe(response => {
      this.toastr.success('Request Completed successfully');
      this.spinner.hide();
      this.modalRef.hide();
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }


}
