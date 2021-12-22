import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-celebrities',
  templateUrl: './list-celebrities.component.html',
  styleUrls: ['./list-celebrities.component.scss']
})
export class ListCelebritiesComponent implements OnInit {
  dataList: any;
  id:any
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

  constructor(private spinner: NgxSpinnerService,
    private toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, private commonService: CommonService
  ) {
   
  }

  ngOnInit() {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if(this.id){
        this.getAll();
      }
    });
   
  }

  /*
  Name: getAll
  Description: Get list of all Celebrity based on category id.
  */
  getAll() {
    this.spinner.show();
    let path = `celebrities/get-all-celebrities-by-categoryId`;
    let options = {
      categoryId: this.id,
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      sortBy: this.sortKey,
      sort: this.sortKeyValue,
      // status: this.filterParams
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
  Name: updateRank
  Description: Update Rank of celebrity
  */
  updateRank(key,rank) {
    this.spinner.show();
    let path = `usercategory/updateRank`;
    let json = {
      id: key,
      rank: rank
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Rank updated successfully');
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }
  
  /*
  Name: changeStatus
  Description: Update status of Celebrity feature
  */
  changeStatus(item, event) {
    this.spinner.show();
    let path = `usercategory/updateFeature`;
    let json = {
      id: item._id,
      isFeatured: event
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Celebrity ' + (event ? 'Featured' : 'Not Featured') + ' successfully');
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }
}
