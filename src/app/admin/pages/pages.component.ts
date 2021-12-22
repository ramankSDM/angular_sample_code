import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  modalRef: BsModalRef;
  dataList: any;
  title: any;
  itemValue: any;
  totalRecords: any;
  page: number;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  loggedInAdmin: any;
  isPageTab:boolean = false;
  constructor(private _cookieservice: CookieService,private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService
  ) {
    this.page = 1;
    this.dataList = [];
    this.loggedInAdmin = JSON.parse(this._cookieservice.get('starin-admin'));
    if (this.loggedInAdmin) {
      if (this.loggedInAdmin.role == 1) {
        this.isPageTab = true;
      } else {
        for (let i = 0; i < this.loggedInAdmin.permissionData.length; i++) {         
          if (this.loggedInAdmin.permissionData[i].permissionId.name == 'Manage Pages') {
            this.isPageTab = true;
          }
        }
      }

    }
  }

  ngOnInit() {
    if(this.isPageTab == false) {
      this.toastr.error('You are not authorized.')
      this.router.navigate(['/admin/profile'])
    }
    this.getAll();
  }

  /*
  Name: getAll
  Description: Get list of all Pages.
  */
  getAll() {
    this.spinner.show();
    let path = `pages/get-all-pages`;
    let options = {
      page: this.activePage,
      count: this.rowsOnPage
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.dataList = response.data.data;
      this.spinner.hide();
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
    let path = `pages/changeStatus`;
    let json = {
      id: item._id,
      status: event
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Page ' + (event ? 'Activated' : 'Deactivated') + ' successfully');
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
    this.page = event.page;
    this.getAll();
  }

   /*
  Name: delete
  Description: Delete the Page
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
  Description: Close the Open popup
  */
  closeModal() {
    this.modalRef.hide();
  }

   /*
  Name: openModal
  Description: Open popup click on Open button
  */
  openModal(template: TemplateRef<any>, data) {
    this.modalRef = this.modalService.show(template);
    this.itemValue = data;
  }

  /*
  Name: updateOrder
  Description: Update the page order
  */
  updateOrder(key,order) {
    this.spinner.show();
    let path = `category/updateOrder`;
    let json = {
      id: key,
      order: order
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Order updated successfully');
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

}

