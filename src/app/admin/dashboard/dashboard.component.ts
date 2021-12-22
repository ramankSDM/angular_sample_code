import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DataService } from "../../services/data.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  recentListingDb = Array;
  recentListingDbCount: number = 7;
  dataList: any;
  list: any;
  data: any;
  filterYear: any;
  filterCelebrity: any;
  filterType: any;
  years: any;
  showMonth: any;
  showYear: any;
  filterStatYear: any;
  filterMonth: any;
  type_value: ''
  type_year: ''
  statYearError: boolean = false;
  monthError: boolean = false;
  filterYearError: boolean = false;
  celebrityError: boolean = false;

  constructor(private _cookieservice: CookieService,
    public ds: DataService,
    public cs: CommonService, private spinner: NgxSpinnerService) {
    this.filterYear = (new Date()).getFullYear();
    this.filterCelebrity = '';
    this.filterType = '';
    this.filterMonth = '';
    this.filterStatYear = '';
    this.showMonth = false;
    this.showYear = false;
    this.years = [];
    this.type_value = '';
    this.type_year = '';
    for (let i = 2020; i <= (new Date()).getFullYear(); i++) {
      this.years.push(i);
    }
    this.dataList = {
      all_types: { all: 0, canceled: 0, completed: 0, pending: 0, rejected: 0, total_amount: 0, total_revenue: 0,last_month_total_amount:0,last_month_total_revenue:0 },
      total_fans: 0, total_celebrities: 0,last_month_total_celebrities: 1, last_month_total_fans: 1,
      igt: { all: 0, canceled: 0, completed: 0, pending: 0, rejected: 0, total_amount: 0, total_revenue: 0,last_month_total_amount: 0,last_month_total_revenue: 0 },
      shoutout: { all: 0, canceled: 0, completed: 0, pending: 0, rejected: 0, total_amount: 0, total_revenue: 0,last_month_total_amount: 0, last_month_total_revenue: 0 },
      zoom_call: { all: 0, canceled: 0, completed: 0, pending: 0, rejected: 0, total_amount: 0, total_revenue: 0,last_month_total_amount: 0, last_month_total_revenue: 0 },
      webinar: {all: 0,canceled: 0,completed: 0,pending: 0, rejected: 0,total_amount: 0,total_revenue: 0,last_month_total_amount: 0,last_month_total_revenue: 0},
      dm: {all: 0,canceled: 0,completed: 0,pending: 0, rejected: 0,total_amount: 0,total_revenue: 0,last_month_total_amount: 0, last_month_total_revenue: 0}
    };
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getStatData();
    this.getCelebrities();
    this.getChartGraphData();
  }

  /*
  Name: getCelebrities
  Description: Get list of celebrities for dropdown
  */
  getCelebrities() {
    let apiPath = `reports/get-all-celebrities`;
    this.cs.get(apiPath).subscribe(result => {
      console.log('celebss', result.data)
      this.list = result.data;
      this.spinner.hide();
    }, err => {
      this.cs.handleError(err);
    });
  }

  /*
  Name: getStatData
  Description: Get the statistics data with filters by default all
  */
  getStatData() {
    if (this.filterType == '2') {
      this.type_value = this.filterMonth;
      if (this.filterMonth == '') {
        this.statYearError = false;
        this.monthError = true;
        return;
      }
      if (this.filterStatYear == '') {
        this.monthError = false;
        this.statYearError = true;
        return;
      }
      if (this.filterMonth != '' && this.filterStatYear != '') {
        this.monthError = false;
        this.statYearError = false;
      }
      this.type_year = this.filterStatYear;
    }
    if (this.filterType == '3') {
      this.type_value = this.filterStatYear;
      if (this.filterStatYear == '') {
        this.statYearError = true;
        return;
      } else {
        this.statYearError = false;
      }
    }

    let apiPath = `booking/get-booking-count`;
    let options = {
      type: this.filterType, //1-today,2-month,3-year
      type_value: this.type_value,
      type_year: this.type_year
    };
    this.cs.queryParams(apiPath, options).subscribe(result => {
      console.log("Result",result);
      if (Object.keys(result.data).length > 0) {
        this.dataList = result.data;
        console.log('this.dataList',this.dataList)
      }
       else {
        this.dataList = {
          all_types: { all: 0, canceled: 0, completed: 0, pending: 0, rejected: 0, total_amount: 0, total_revenue: 0,last_month_total_amount:0,last_month_total_revenue:0  },
          total_fans: 0, total_celebrities: 0,last_month_total_celebrities: 1, last_month_total_fans: 1,
          igt: { all: 0, canceled: 0, completed: 0, pending: 0, rejected: 0, total_amount: 0, total_revenue: 0 ,last_month_total_amount:0,last_month_total_revenue:0 },
          shoutout: { all: 0, canceled: 0, completed: 0, pending: 0, rejected: 0, total_amount: 0, total_revenue: 0,last_month_total_amount:0,last_month_total_revenue:0  },
          zoom_call: { all: 0, canceled: 0, completed: 0, pending: 0, rejected: 0, total_amount: 0, total_revenue: 0,last_month_total_amount:0,last_month_total_revenue:0  },
          webinar: {all: 0,canceled: 0,completed: 0,pending: 0, rejected: 0,total_amount: 0,total_revenue: 0,last_month_total_amount:0,last_month_total_revenue:0 },
          dm: {all: 0,canceled: 0,completed: 0,pending: 0, rejected: 0,total_amount: 0,total_revenue: 0,last_month_total_amount:0,last_month_total_revenue:0 }
        };
      }
      this.spinner.hide();
    }, err => {
      this.cs.handleError(err);
    });
  }

  /*
  Name: getAdditionalData
  Description: Get the month and year fileds based on first type filter
  */
  getAdditionalData() {
    this.filterMonth = '';
    this.filterStatYear = '';
    this.showMonth = false;
    this.showYear = false;
    if (this.filterType == '2') {
      this.showMonth = true;
      this.showYear = true;
      this.type_value = this.filterMonth;
    }
    if (this.filterType == '3') {
      this.showYear = true;
      this.type_value = this.filterStatYear;
    }
  }

  /*
  Name: getGraphData
  Description: Get the graph data with filters by default all
  */
  getGraphData() {
    console.log(this.filterYear, this.filterCelebrity);
    if (this.filterCelebrity == '') {
      this.filterYearError = false;
      this.celebrityError = true;
      return;
    }
    if (this.filterYear == '') {
      this.celebrityError = false;
      this.filterYearError = true;
      return;
    }
    if (this.filterCelebrity != '' && this.filterYear != '') {
      this.celebrityError = false;
      this.filterYearError = false;
    }
    this.getChartGraphData();
  }

  /*
  Name: getChartGraphData
  Description: Get the graph chart data
  */
  getChartGraphData() {
    // this.data = {
    //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [
    //         {
    //             label: 'Revenue',
    //             backgroundColor: '#42A5F5',
    //             borderColor: '#1E88E5',
    //             data: [65, 59, 80, 81, 56, 55, 40]
    //         },
    //         {
    //             label: 'Refund',
    //             backgroundColor: '#9CCC65',
    //             borderColor: '#7CB342',
    //             data: [28, 48, 40, 19, 86, 27, 90]
    //         }
    //     ]
    // }
    let apiPath = `reports/get-reports`;
    let options = {
      celebrityId: this.filterCelebrity,
      year: this.filterYear
    };
    this.cs.queryParams(apiPath, options).subscribe(result => {
      if (Object.keys(result.data).length > 0) {
        this.data = result.data;
        console.log('this.data', this.data)
      } else {

      }
      this.spinner.hide();
    }, err => {
      this.cs.handleError(err);
    });
  }

  clear() {
    this.filterYear = (new Date()).getFullYear();
    this.filterCelebrity = '';
    this.getGraphData();
  }

  clear2() {
    this.filterType = '';
    this.filterMonth = '';
    this.filterStatYear = '';
    this.getStatData();
  }

}