import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';



@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss']
})
export class CareerComponent implements OnInit {
  pageData: any;
  selectedLang: any = 'en';
  langs: any = [];



  constructor(private spinner: NgxSpinnerService, private toastr: ToastrService, private commonService: CommonService, public ds: DataService,private translate: TranslateService) { }


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
      this.commonService.getById(path, 'career').subscribe(async res => {
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
