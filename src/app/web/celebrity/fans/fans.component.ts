import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-fans',
  templateUrl: './fans.component.html',
  styleUrls: ['./fans.component.scss']
})
export class FansComponent implements OnInit {
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
  reason:any;
  selectedLang: any = 'en';
  langs: any = [];
  constructor(private spinner: NgxSpinnerService, private modalService: BsModalService, private _cookieservice: CookieService, private toastr: ToastrService, private router: Router, private commonService: CommonService,
    private translate: TranslateService,public ds: DataService) {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
   }

  ngOnInit(): void {
    this.getFans();

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
  }

  /*
  Name: getFans
  Description: Get list of all Fans for celebrity
  */
  getFans() {
    this.spinner.show();
    let CFUser = this._cookieservice.get('user-starsin');
    let NewCFUser = JSON.parse(CFUser);
    let userId = NewCFUser._id;
    let path = `fanclub/get-all-fans`;  
    let options = {
      id:userId,
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      sortBy: this.sortKey,
      sort: this.sortKeyValue,
      status: this.filterParams
    };
    let finalList = [];
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
    this.getFans();
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
    this.getFans();
  }

  /*
  Name: pageChanged
  Description: when change the page from pagination,it will get new page records
  */
  pageChanged(event: any): void {
    this.page = event.page;
    this.getFans();
  }

  /*
  Name: removeFan
  Description: Remove the fan from fanclub listing
  */
  removeFan(id){
    this.spinner.show();
    let path = `fanclub/delete/` + id;
    this.commonService.delete(path).subscribe(response => {
      this.toastr.success('Successfully removed');
      this.getFans();
      this.spinner.hide();      
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: blockFan
  Description: Block the fan from fanclub listing
  */
  blockFan(id,status) {
    this.spinner.show();  
    if(status == false){
      this.reason = 'Un-Block';
    } 
    let path = `fanclub/updateBlockStatus`;  
    let options = {
      id:id,
      blocked:status,
      block_reason:this.reason
    };
    this.commonService.put(path, options).subscribe(response => {
      if(status == 'true'){
        this.reason = '';
        this.toastr.success('Successfully blocked');
        this.modalRef.hide();
      } else{
        this.toastr.success('Successfully Un-blocked');
      }          
      this.getFans();          
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: flagFan
  Description: Mark as Flag to fan from fanclub listing
  */
  flagFan(id,status) {    
    this.spinner.show();   
    if(status == false){
      this.reason = 'Un-Flag';
    }
    let path = `fanclub/flag`;  
    let options = {
      id:id,
      flag:status,
      flag_reason:this.reason
    };
    this.commonService.put(path, options).subscribe(response => {
      if(status == 'true'){
        this.reason = '';
        this.toastr.success('Successfully Flagged');
        this.modalRef.hide();
      } else{
        this.toastr.success('Successfully Un-flagged');
      }                
      this.getFans();          
      this.spinner.hide();
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

}
