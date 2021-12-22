import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {

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
  unassignedList: any = [];
  tempArr: any = [];
  loggedInAdmin: any;
  isPromotionTab: boolean = false;

  constructor(private _cookieservice: CookieService, private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService
  ) {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.loggedInAdmin = JSON.parse(this._cookieservice.get('starin-admin'));
    if (this.loggedInAdmin) {
      if (this.loggedInAdmin.role == 1) {
        this.isPromotionTab = true;
      } else {
        for (let i = 0; i < this.loggedInAdmin.permissionData.length; i++) {
          if (this.loggedInAdmin.permissionData[i].permissionId.name == 'Promotions') {
            this.isPromotionTab = true;
          }
        }
      }

    }
  }

  ngOnInit() {
    if (this.isPromotionTab == false) {
      this.toastr.error('You are not authorized.')
      this.router.navigate(['/admin/profile'])
    }
    this.getAll();
  }

  /*
  Name: getAll
  Description: Get list of all Promotions.
  */
  getAll() {
    this.spinner.show();
    let path = `promoCode/get-all-promoCode`;
    let options = {
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
    let path = `promoCode/updateStatus`;
    let json = {
      id: item._id,
      status: event
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Promo Code ' + (event ? 'Activated' : 'Deactivated') + ' successfully');
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
  Description: Delete the Promotion
  */
  delete() {
    this.spinner.show();
    this.modalRef.hide();
    let path = `promoCode/delete/` + this.itemValue._id;
    this.commonService.delete(path).subscribe(response => {
      this.toastr.success('Promo Code deleted successfully');
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
    this.unassignedList = []
    this.tempArr = []
    this.modalRef.hide();
  }

  /*
  Name: openModal
  Description: Open popup click on Action button
  */
  openModal(template: TemplateRef<any>, data, type) {
    this.itemValue = data;
    if (type == "share") {
      let path = `userPromoCode/get-by-id`;
      this.commonService.getById(path, this.itemValue._id).subscribe(response => {

        for (let i = 0; i < response.data.length; i++) {
          this.unassignedList.push({ "label": response.data[i].fname_en +" "+ response.data[i].lname_en ,"value": response.data[i]._id})
        }
        
        

        this.modalRef = this.modalService.show(template, {
          backdrop: 'static',
          keyboard: false
          
        });
     
      
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      });
    } else {
      this.modalRef = this.modalService.show(template);
    }
    

  }

  /*
  Name: assignPromo
  Description: Assign the promo code to Promotion
  */
  assignPromo() {
    let finalArray = []
    for (let i = 0; i < this.tempArr.length; i++) {
      finalArray.push({ code_id: this.itemValue._id, user_id: this.tempArr[i] })
      
    }
    let path = 'promoCode/assign';
    this.commonService.post(path, finalArray).subscribe(res => {
      if (res.status == 200) {
        this.unassignedList = []
        this.tempArr = []
        this.modalRef.hide();
        this.toastr.success(res.message);
        this.router.navigate(['/admin/promotions'])
      } else {
        this.toastr.error(res.message);
      }
    },
      (err) => {
        this.commonService.loading(false)
        this.commonService.handleError(err);
        this.router.navigate(['/admin/promotions'])
      }
    );
  }

 


}

