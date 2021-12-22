import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-got-talent',
  templateUrl: './got-talent.component.html',
  styleUrls: ['./got-talent.component.scss']
})
export class GotTalentComponent implements OnInit {

  modalRef: BsModalRef;
  modalRef1: BsModalRef;
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
  requestType:number=2;
  isFanCancel:any;
  constructor(private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService
  ) {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
  }

  ngOnInit() {
    this.isFanCancel = 'false';
    this.getAll();
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
  openModal(template: TemplateRef<any>, data) {
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

}
