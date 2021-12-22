import {
  Component,
  OnInit,
  TemplateRef
} from '@angular/core';
import {
  NgxSpinnerService
} from 'ngx-spinner';
import {
  BsModalService,
  BsModalRef
} from 'ngx-bootstrap/modal';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import {
  CommonService
} from 'src/app/services/common.service';
import {
  environment
} from 'src/environments/environment';
import {
  IDropdownSettings
} from 'ng-multiselect-dropdown';
import {
  CookieService
} from 'ngx-cookie';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  modalRef: BsModalRef;
  dataList: any;
  title: any;
  itemValue: any;
  totalRecords: any;
  requestType: any = '';
  avgRating = 0
  page: number;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  sortKey: any = "_id";
  sortKeyValue: any = 'DESC';
  filterParams: any;
  filterStatus: any;
  loggedInAdmin: any;
  isCelebritiesTab: boolean = false;

  constructor(private _cookieservice: CookieService, private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private commonService: CommonService) {
    this.page = 1;
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';


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

  ngOnInit(): void {
    if (this.isCelebritiesTab == false) {
      this.toastr.error('You are not authorized.')
      this.router.navigate(['/admin/profile'])
    }
    this.getAll();
  }

  getAll() {
    this.spinner.show();
    let path = `platform-rating/get`;
    let options = {
      page: this.activePage,
      count: this.rowsOnPage,
      sort: this.sortKeyValue,
      status: this.filterParams,
      requestType: this.requestType ? this.requestType : "",
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.avgRating = response.data.averageRating
      this.dataList = response.data.data;
      this.totalRecords = response.data.total;
      this.spinner.hide();
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


}