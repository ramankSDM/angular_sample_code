import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  modalRef: BsModalRef;
  dataList: any;
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
  isTagsTab: boolean = false;
  constructor(private _cookieservice: CookieService, private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService) {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.loggedInAdmin = JSON.parse(this._cookieservice.get('starin-admin'));
    if (this.loggedInAdmin) {
      if (this.loggedInAdmin.role == 1) {
        this.isTagsTab = true;
      } else {
        for (let i = 0; i < this.loggedInAdmin.permissionData.length; i++) {
          if (this.loggedInAdmin.permissionData[i].permissionId.name == 'Tags Mangement') {
            this.isTagsTab = true;
          }
        }
      }

    }
  }
  

  ngOnInit() {
    if (this.isTagsTab == false) {
      this.toastr.error('You are not authorized.')
      this.router.navigate(['/admin/profile'])
    }
    this.getAll();
  }

  /*
Name: getAll
Description: Get list of all Tags.
*/
  getAll() {
	  //alert(this.rowsOnPage)
    this.spinner.show();
    let path = `tags/get-all`;
    let options = {};
     options = {
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      sortBy: this.sortKey,
      sort: this.sortKeyValue,
      status: this.filterParams
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.dataList = response.data.data;
	  this.totalRecords = response.data.total;
	  //this.totalRecords = this.dataList.length;
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
Description: Change status of Tag activated and de-activated
*/
  changeStatus(item, event) {
    this.spinner.show();
    let path = `tags/updateStatus`;
    let json = {
      id: item._id,
      status: event
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Tag ' + (event ? 'Activated' : 'Deactivated') + ' successfully');
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
	//alert(this.activePage)
    this.getAll();
  }

  /*
Name: delete
Description: Delete the Tag
*/
  delete() {
    this.spinner.show();
    this.modalRef.hide();
    let path = `tags/delete/` + this.itemValue._id;
    this.commonService.delete(path).subscribe(response => {
      this.toastr.success('Tag deleted successfully');
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
Description: Close the Open popup
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
Name: updateOrder
Description: Update the order of Tag
*/
  updateOrder(key, order) {
    this.spinner.show();
    let path = `tags/updateOrder`;
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

  /*
  Name: download Csv
  Description: download csv with filters
  */
  downloadReport() {
    this.spinner.show();
    let path = `downloads/tag`;
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
