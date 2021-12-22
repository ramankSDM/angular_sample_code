import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-celebrities',
  templateUrl: './celebrities.component.html',
  styleUrls: ['./celebrities.component.scss']
})
export class CelebritiesComponent implements OnInit {
  modalRef: BsModalRef;
  dataList: any;
  catList: any;
  tagList: any;
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
  filterCat: any;
  filterTag: any;
  loggedInAdmin: any;
  isCelebritiesTab: boolean = false;
  constructor(private _cookieservice: CookieService, private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService
  ) {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.filterCat = '';
    this.filterTag = '';
    this.loggedInAdmin = JSON.parse(this._cookieservice.get('starin-admin'));
    if (this.loggedInAdmin) {
      if (this.loggedInAdmin.role == 1) {
        this.isCelebritiesTab = true;
      } else {
        for (let i = 0; i < this.loggedInAdmin.permissionData.length; i++) {
          if (this.loggedInAdmin.permissionData[i].permissionId.name == 'Celebrity Management') {
            this.isCelebritiesTab = true;
          }
        }
      }

    }
  }

  ngOnInit() {
    if (this.isCelebritiesTab == false) {
      this.toastr.error('You are not authorized.')
      this.router.navigate(['/admin/profile'])
    }
    this.getAll();
    this.getAllCategories();
    this.getAllTags();
  }

  /*
  Name: getAll
  Description: Get list of all celebrities.
  */
  getAll() {
    this.spinner.show();
    let path = `user/get-all-users`;
    let options = {
      role: 3,
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      sortBy: this.sortKey,
      sort: this.sortKeyValue,
      status: this.filterParams,
      categoryId: this.filterCat,
      //tagId: this.filterTag
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.dataList = response.data.data;
      console.log( this.dataList)
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
  Description: Delete the celebrity
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
  Description: Close the Delete popup
  */
  closeModal() {
    this.modalRef.hide();
  }

  /*
  Name: openModal
  Description: Open popup click on Delete button
  */
  openModal(template: TemplateRef<any>, data) {
    this.modalRef = this.modalService.show(template);
    this.itemValue = data;
  }

  /*
  Name: getAllCategories
  Description: Get list of all categories.
  */
  getAllCategories() {
    this.spinner.show();
    let path = `category/get-all-category`;
    let options = {
      page: 1,
      count: 1000,
      search: '',
      sortBy: '',
      sort: '',
      status: true
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.catList = response.data.data;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: getAllTags
  Description: Get list of all tags.
  */
  getAllTags() {
    this.spinner.show();
    let path = `tags/get-all`;
    let options = {
      page: 1,
      count: 1000,
      search: '',
      sortBy: '',
      sort: '',
      status: true
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.tagList = response.data.data;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: download Csv
  Description: download csv with filters
  */
  downloadReport() {
    this.spinner.show();
    let path = `downloads/celebrity`;
    let options = {
      search: this.searchKey,
      status: this.filterParams,
      categoryId: this.filterCat
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
