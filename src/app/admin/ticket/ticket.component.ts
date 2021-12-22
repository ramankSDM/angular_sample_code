import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  modalRef: BsModalRef;
  ticketList: any;
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
  isTicketTab: boolean = false;

  constructor(private _cookieservice: CookieService,private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService
  ) {
    this.page = 1;
    this.searchKey = '';
    this.ticketList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.loggedInAdmin = JSON.parse(this._cookieservice.get('starin-admin'));
    if (this.loggedInAdmin) {
      if (this.loggedInAdmin.role == 1) {
        this.isTicketTab = true;
      } else {
        for (let i = 0; i < this.loggedInAdmin.permissionData.length; i++) {
          if (this.loggedInAdmin.permissionData[i].permissionId.name == 'Support Tickets') {
            this.isTicketTab = true;
          }
        }
      }

    }
  }

  ngOnInit() {
    if (this.isTicketTab == false) {
      this.toastr.error('You are not authorized.')
      this.router.navigate(['/admin/profile'])
    }
    this.getAll();
  }

  /*
  Name: getAll
  Description: Get list of all tickets.
  */
  getAll() {
    this.spinner.show();
    let path = `contact/get-all`;
    let options = {
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      status: this.filterParams
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.ticketList = response.data.data;
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
    if (this.filterStatus == 'open') {
      this.filterParams = false;
    } else if (this.filterStatus == 'closed') {
      this.filterParams = true;
    } else {
      this.filterParams = '';
    }
    this.getAll();
  }

  /*
  Name: changeStatus
  Description: Change status of tickect open and closed
  */
  changeStatus(item, event) {
    this.spinner.show();
    let path = `contact/updateStatus`;
    let json = {
      id: item._id,
      status: event
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Ticket ' + (event ? 'Closed' : 'Open') + ' successfully');
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
  Name: clear all filter
  Description: function to clear all the selected filters
  */
  clearFilter() {
    this.activePage = 1;
    this.searchKey = '';
    this.ticketList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.getAll();
  }


}

