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
  selector: 'app-share-profile',
  templateUrl: './share-profile.component.html',
  styleUrls: ['./share-profile.component.scss']
})
export class ShareProfileComponent implements OnInit {
  selectedLang: any = 'en';
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
  unassignedList:any = [];
  tempArr:any = [];
  uid: any;

  constructor(private _cookieservice: CookieService,private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService
  ) {
    this.page = 1;
    this.uid = "";
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.selectedLang = localStorage.currentLang ? localStorage.currentLang : 'en'
    console.log('selectedLang',this.selectedLang);
  }

  ngOnInit() {
    this.getAll(); 
   
  }

  // delete() {
  //   this.spinner.show();
  //   this.modalRef.hide();
  //   let path = `promoCode/delete/` + this.itemValue._id;
  //   this.commonService.delete(path).subscribe(response => {
  //     this.toastr.success('Promo Code deleted successfully');
  //     this.getAll();
  //   }, err => {
  //     this.spinner.hide();
  //     this.commonService.handleError(err);
  //   });
  // }

  /*
  Name: getAll
  Description: Get list of all shared promo codes
  */
  getAll() {
    let SPUser = this._cookieservice.get('user-starsin');
    let NewSPUser = JSON.parse(SPUser);
    let userId = NewSPUser._id;
    this.spinner.show();
    let path = `promoCode/get-all-promoShareCode`;
    
    let options = {
      id:userId,
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      sortBy: this.sortKey,
      sort: this.sortKeyValue,
      status: this.filterParams
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
    this.page = event.page;
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
  Name: closeModal
  Description: Close the open popup
  */
  closeModal() {
    this.unassignedList = []
    this.tempArr = []
    this.modalRef.hide();
  }

  openModal(template: TemplateRef<any>, data, type) {
    this.itemValue = data;
    if (type == "share") {
      let path = `userPromoCode/get-by-id`;
      this.commonService.getById(path, this.itemValue._id).subscribe(response => {

        for (let i = 0; i < response.data.length; i++) {
          this.unassignedList.push({ "label": response.data[i].fname_en +" "+ response.data[i].lname_en ,  "value": response.data[i]._id })
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
}