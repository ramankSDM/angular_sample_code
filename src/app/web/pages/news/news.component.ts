import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  pageData: any;
  selectedLang: any = 'en';
  langs: any = [];

  constructor(private commonService: CommonService, public ds: DataService,private translate: TranslateService) { }


  ngOnInit(): void {
    this.getPageData();
    
    this.langs = [{ name: 'English', code: 'en' }, { name: 'Arabic', code: 'ar' }];
    this.selectedLang = localStorage.currentLang ? localStorage.currentLang : 'en' // here getting the selected language
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
   Name: Get About us 
   Description: Api call to get the about us page data on the basis of slug
   */
   async getPageData() {
    let path = 'pages/get-by-slug';
    return new Promise((resolve, reject) => {
      this.commonService.getById(path, 'news').subscribe(async res => {
        this.pageData = res.data
      },
        (err) => {
          this.commonService.loading(false)
          this.commonService.handleError(err);
        }
      );
    });
  }

}
