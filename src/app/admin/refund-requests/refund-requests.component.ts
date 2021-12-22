import { Component, OnInit, TemplateRef} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-refund-requests',
  templateUrl: './refund-requests.component.html',
  styleUrls: ['./refund-requests.component.scss']
})
export class RefundRequestsComponent implements OnInit {

  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  modalRef2: BsModalRef;
  dataList: any;  
  viewData: any;
  totalRecords: any;
  page: number;
  searchKey: any;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  sortKey: any = "updatedAt";
  sortKeyValue: any = 'DESC';
  filterParams: any;
  filterStatus: any;
  requestType: any = '';
  itemValue: any;
  reject_reason: string = '';
  reasornError: boolean = false;
  loggedInAdmin: any;
  isRefundTab: boolean = false;

  constructor(private _cookieservice: CookieService,private spinner: NgxSpinnerService, private modalService: BsModalService,private toastr: ToastrService, private router: Router, private commonService: CommonService) {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.loggedInAdmin = JSON.parse(this._cookieservice.get('starin-admin'));
    if (this.loggedInAdmin) {
      if (this.loggedInAdmin.role == 1) {
        this.isRefundTab = true;
      } else {
        for (let i = 0; i < this.loggedInAdmin.permissionData.length; i++) {
          if (this.loggedInAdmin.permissionData[i].permissionId.name == 'Refund Request') {
            this.isRefundTab = true;
          }
        }
      }

    }
  }

  ngOnInit(){
    if (this.isRefundTab == false) {
      this.toastr.error('You are not authorized.')
      this.router.navigate(['/admin/profile'])
    }
    this.getAll();
  }

  /*
  Name: getAll
  Description: Get list of all Refund Requests listing.
  */
  getAll() {
    this.spinner.show();
    let path = `refund/get-all-refunds`;
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
    this.filterStatus = this.filterStatus;
    this.requestType = this.requestType;
    this.getAll();
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
  Name: openModal
  Description: Open popup click on Reject button
  */
  openModal(template: TemplateRef<any>, data, status) {
    this.reject_reason = '';
    this.reasornError = false;
    this.modalRef = this.modalService.show(template);
    this.itemValue = data;
  }

  /*
  Name: closeModal
  Description: Close the Reject popup
  */
  closeModal() {
    this.modalRef.hide();
  }

  /*
  Name: openModal2
  Description: Open popup click on View and Accept Refund button
  */
  openModal2(template: TemplateRef<any>, data) {
    this.modalRef1 = this.modalService.show(template);
    this.viewData = data; 
  }

  /*
  Name: closeModal2
  Description: Close the View and Accept Refund popup
  */
  closeModal2() {
    this.modalRef1.hide();
  }

  /*
  Name: requestToCelebrity
  Description: Send request to celebrity to review the refund
  */
  requestToCelebrity(item) {
    this.updateStatus(item._id,3); 
  }

  /*
  Name: acceptRefundRequest
  Description: Accept refund request
  */
  acceptRefundRequest(item){
    this.spinner.show();
    this.updateStatus(item._id,1);    
  }

  /*
  Name: rejectRefundRequest
  Description: Reject refund request
  */
  rejectRefundRequest(item){
    if (this.reject_reason == '') {
      this.reasornError = true;
    } else {
      this.reject_reason = this.reject_reason;
      this.updateStatus(item._id,2);       
    }
  }

   /*
  Name: updateStatus
  Description: Common function to update Refund request status 
  */
  updateStatus(id,status){
    let path = `refund/updateStatus`;
    let json = {
      bookingId: id,
      refundStatus:status  //0 : default,1:Accept,2:Reject,3: requestToCelebrity, 4: rejectedByCeleb
    };
    this.commonService.post(path, json).subscribe(response => {
      console.log('response',response)
      if(status == 1){
        this.toastr.success('Request accepted successfully');     
        this.modalRef1.hide();
      } else if(status == 2){
        this.toastr.success('Request rejected successfully');     
        this.modalRef.hide();
      } else if(status == 3){
        this.toastr.success('Send Request to celebrity successfully');     
        this.modalRef1.hide();
      }      
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }


}