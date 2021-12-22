import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  modalRef: BsModalRef;
  dealersList: any;
  title: any;
  itemValue: any;
  totalRecords: any;
  page: number;
  searchKey: any;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  sortKey: any = "_id";
  sortKeyValue: any = 'DESC';
  filterParams: any;
  filterStatus: any;
  loggedInAdmin: any;
  isFaqTab:boolean = false;
  constructor(private _cookieservice: CookieService,private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService
  ) {
    this.page = 1;
    this.searchKey = '';
    this.dealersList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.loggedInAdmin = JSON.parse(this._cookieservice.get('starin-admin'));
    if (this.loggedInAdmin) {
      if (this.loggedInAdmin.role == 1) {
        this.isFaqTab = true;
      } else {
        for (let i = 0; i < this.loggedInAdmin.permissionData.length; i++) {         
          if (this.loggedInAdmin.permissionData[i].permissionId.name == 'Manage Faq') {
            this.isFaqTab = true;
          }
        }
      }

    }
   }

  ngOnInit(): void {
    if(this.isFaqTab == false) {
      this.toastr.error('You are not authorized.')
      this.router.navigate(['/admin/profile'])
    }
    this.getAll();
  }

  /*
  Name: getAll
  Description: Get list of all FAQs.
  */
  getAll() {
    this.spinner.show();
    let path = `faqs/get-all`;
    let options = {
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      status: this.filterParams
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.dealersList = response.data.data;
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
  Name: pageChanged
  Description: when change the page from pagination,it will get new page records
  */
  pageChanged(event: any): void {
    //this.page = event.page;
	this.activePage = event.page;
    this.getAll();
  }

  /*
  Name: changeStatus
  Description: Change status of Booking activated and de-activated
  */
  changeStatus(item, event) {
    this.spinner.show();
    let path = `faqs/changeStatus`;
    let json = {
      id: item._id,
      status: event
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Question ' + (event ? 'Activated' : 'Deactivated') + ' successfully');
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: openModal
  Description: Open popup click on action button
  */
  openModal(template: TemplateRef<any>, data) {
    this.modalRef = this.modalService.show(template);
    this.itemValue = data;
  }

  /*
  Name: closeModal
  Description: Close the open popup
  */
  closeModal() {
    this.modalRef.hide();
  }

  /*
  Name: delete
  Description: Delete the FAQ
  */
  delete() {
    this.spinner.show();
    this.modalRef.hide();
    let path = `faqs/delete/` + this.itemValue._id;
    this.commonService.delete(path).subscribe(response => {
      this.toastr.success('Faq deleted successfully');
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }
}
