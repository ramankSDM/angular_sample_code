import { Component, OnInit,TemplateRef } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DataService } from "../../../../services/data.service";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-dm',
  templateUrl: './dm.component.html',
  styleUrls: ['./dm.component.scss']
})
export class DmComponent implements OnInit {

  bookingList: any;
  totalRecords: any;
  page: number;
  searchKey: any;
  public activePage: number = 1;
  public rowsOnPage: number = 10;  //environment.LIMIT;
  sortKey: any = "bookingDateTime";
  sortKeyValue: any = 'ASC';
  filterParams: any;
  filterStatus: any;
  requestType: number = 5;
  selectedLang: any = 'en';
  langs: any = [];

  constructor(private _cookieservice: CookieService,
    public ds: DataService,
    public cs: CommonService,
    public router: Router,private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService, private commonService: CommonService,private translate: TranslateService,) {
      this.page = 1;
      this.searchKey = '';
      this.filterStatus = '';
      this.filterParams = '';
    }

  ngOnInit(): void {
    this.getAll();

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
  Name: getAll
  Description: Get list of all type of bookings requests
  */
  getAll() {   
    this.spinner.show();
    let path = `booking/get-all`;
    let options = {
      type: this.requestType,
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      status: this.filterStatus
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.bookingList = response.data.data;
      console.log('this.dataList dm',this.bookingList)
      this.totalRecords = response.data.total;
      this.spinner.hide();
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
  Name: pageChanged
  Description: when change the page from pagination,it will get new page records
  */
  pageChanged(event: any): void {
    this.activePage = event.page;
    this.getAll();
  }

  /*
  Name: publishMessage
  Description: Change status of message to public or private
  */
  publishMessage(id, status, type) {
    this.spinner.show();
    let path = `booking/update-dm-status`;
    let options = {
      booking_id: id,
      isPublic : Boolean = status,
      requestType: type
    };
    this.commonService.put(path, options).subscribe(response => {
      if (status == true) {
        this.toastr.success('Successfully Un-Published');
      } else {
        this.toastr.success('Successfully Published');
      }
      this.getAll();
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

}
