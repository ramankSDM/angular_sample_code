import { Component, OnInit,TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DataService } from "./../../../services/data.service";
import { AddToWalletComponent } from "./add-to-wallet/add-to-wallet.component"
import { NgbModal, ModalDismissReasons, NgbModalOptions, } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  modalRef: BsModalRef;
  dataList: any;  
  language: any;
  modalOptions: NgbModalOptions;
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
  fanInfo:any;
  selectedLang: any = 'en';
  langs: any = [];

  constructor(private nbModalService: NgbModal, private spinner: NgxSpinnerService, private modalService: BsModalService,private toastr: ToastrService, private router: Router, private commonService: CommonService, private translate: TranslateService, public ds: DataService) {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = ''; 
    this.fanInfo = [];
  }

  ngOnInit(): void {
    this.langs = [{ name: 'English', code: 'en' }, { name: 'Arabic', code: 'ar' }];
    this.selectedLang = localStorage.currentLang ? localStorage.currentLang : 'en'
    this.ds.get().subscribe(async (data) => {
      if (data.key == "currentLang") {
        this.selectedLang = data.set;
        this.translate.use(this.selectedLang)
      }
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLang = this.translate.currentLang ? this.translate.currentLang : 'en';
    });

    this.getProfileInfo();
    this.getAll();
  }

  getChangedLanguage(event) {
    this.language = event.target.value;
  }

  getProfileInfo(){
    let apiPath = `user/get-profile`;
    this.commonService.get(apiPath).subscribe(result => {
      this.fanInfo = result.data;      
      console.log('this.fanInfo',this.fanInfo);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
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
      console.log('this.dataList',response)
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
    Description: Open popup click on View button
    */
  openModal(template: TemplateRef<any>, data) {
    this.modalRef = this.modalService.show(template);
    this.viewData = data; 
  }

  /*
  Name: closeModal
  Description: Close the View popup
  */
  closeModal() {
    this.modalRef.hide();
  }

  addToWallet(){
    var obj = {
        fname_en: this.dataList.fname_en,
        fname_ar: this.dataList.fname_ar,
        lname_en: this.dataList.lname_en,
        lname_ar: this.dataList.lname_ar,
        _id: this.dataList._id,
        email: this.dataList.email,
        image: this.dataList.image,
        totalAmount: this.dataList.dedicated_price,
        lang: this.dataList.lang,
      }
      const modalRef = this.nbModalService.open(AddToWalletComponent, {
        windowClass: "modal-holder",
        backdrop: 'static',
        keyboard: false,
      });
      modalRef.componentInstance.dataList = obj;
      modalRef.result.then((data) => {
        this.getProfileInfo()
        this.router.navigate(['/fans/wallet']);
        // on close
      }, (reason) => {
        console.log("model close: ", reason)
        // on dismiss
      });
  }

}
