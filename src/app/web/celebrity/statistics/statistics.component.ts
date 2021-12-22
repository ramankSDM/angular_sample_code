import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DataService } from "../../../services/data.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  dataList: any;
  selectedLang: any = 'en';
  langs: any = [];

  constructor(private _cookieservice: CookieService,
    public ds: DataService,
    public cs: CommonService,private spinner: NgxSpinnerService,private translate: TranslateService,) { 
      this.dataList = {
        all_types: {all: 0,canceled: 0,completed: 0,pending: 0, rejected: 0,total_amount: 0,total_revenue: 0},
        fan_followers: 0,
        igt: {all: 0,canceled: 0,completed: 0,pending: 0, rejected: 0,total_amount: 0,total_revenue: 0},
        shoutout: {all: 0,canceled: 0,completed: 0,pending: 0, rejected: 0,total_amount: 0,total_revenue: 0},
        zoom_call: {all: 0,canceled: 0,completed: 0,pending: 0, rejected: 0,total_amount: 0,total_revenue: 0},
        webinar: {all: 0,canceled: 0,completed: 0,pending: 0, rejected: 0,total_amount: 0,total_revenue: 0},
        dm: {all: 0,canceled: 0,completed: 0,pending: 0, rejected: 0,total_amount: 0,total_revenue: 0}
      };
    }

  ngOnInit(): void {
      this.spinner.show();
      let apiPath = `booking/get-booking-count`;
      this.cs.get(apiPath).subscribe(result => {
        this.dataList = result.data;
        console.log('this.dataList',this.dataList)
        this.spinner.hide(); 
      }, err => {
        this.cs.handleError(err);
      });

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

}
