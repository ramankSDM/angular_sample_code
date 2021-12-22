import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categoryList: any = [];
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;

  constructor(private spinner: NgxSpinnerService,private cs: CommonService) { }

  ngOnInit() {
    this.getCategories();

  }

  /*
  Name: getCategories
  Description: Get list of all categories
  */
  getCategories() {     
    let path = `category/get-all`;
    let options = {
      page: this.activePage,
      count: 1000
    };
    this.cs.queryParams(path, options).subscribe(response => {
      this.categoryList = response.data.data;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.cs.handleError(err);
    });    
  }

}
