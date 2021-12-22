import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sub-admin',
  templateUrl: './sub-admin.component.html',
  styleUrls: ['./sub-admin.component.scss']
})
export class SubAdminComponent implements OnInit {
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
  constructor(private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService
  ) { 
    this.page = 1;
    this.searchKey = '';
    this.dealersList = [];
    this.filterStatus = '';
    this.filterParams = '';
  }

  ngOnInit(): void {
    this.getAll();
  }

  /*
  Name: getAll
  Description: Get list of all Sub-Admins.
  */
 getAll() {
  this.spinner.show();
  let path = `user/get-all-users`;
  let options = {
    role: 4,
    page: this.activePage,
    count: this.rowsOnPage,
    search: this.searchKey,
    sortBy: this.sortKey,
    sort: this.sortKeyValue,
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
Name: changeStatus
Description: Change status of Sub-admin activated and de-activated
*/
changeStatus(item, event) {
  this.spinner.show();
  let path = `user/updateStatus`;
  let json = {
    id: item._id,
    status: event
  };
  this.commonService.put(path, json).subscribe(response => {
    this.toastr.success('Sub-Admin ' + (event ? 'Activated' : 'Deactivated') + ' successfully');
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
  //this.page = event.page;
  this.activePage = event.page;
  this.getAll();
}

/*
Name: delete
Description: Delete the sub-admin
*/
delete() {
  this.spinner.show();
  this.modalRef.hide();
  let path = `user/delete/` + this.itemValue._id;
  this.commonService.delete(path).subscribe(response => {
    this.toastr.success('Sub-Admin deleted successfully');
    this.getAll();
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
Name: closeModal
Description: Close the open popup
*/
closeModal() {
  this.modalRef.hide();
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
  Name: download Csv
  Description: download csv with filters
  */
 downloadReport() {
  this.spinner.show();
  let path = `downloads/subAdmin`;
  let options = {
    search: this.searchKey,
    status: this.filterParams
  };
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
