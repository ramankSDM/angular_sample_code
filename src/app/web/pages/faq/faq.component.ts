import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  pageData: any;
  selectedLang: any = 'en';
  data: any;
  langs: any = [];
  constructor(private spinner: NgxSpinnerService,private translate: TranslateService, public ds: DataService, private toastr: ToastrService, private commonService: CommonService) { }

  ngOnInit(): void {

    this.langs = [{ name: 'English', code: 'en' }, { name: 'Arabic', code: 'ar' }];
    this.selectedLang = localStorage.currentLang ? localStorage.currentLang : 'en' // Getting selected language
    this.ds.get().subscribe(async (data) => {
      if (data.key == "currentLang") {
        this.selectedLang = data.set;
        this.translate.use(this.selectedLang)
      }
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLang = this.translate.currentLang ? this.translate.currentLang : 'en';
    });
    this.getPageData();
  }

  /*
   Name: Get Faq
   Description: Api call to get the faqs
   */
  async getPageData() {
    let path = 'faqs/get-all-faqs';
    return new Promise((resolve, reject) => {
      this.commonService.queryParams(path, {}).subscribe(async res => {
        this.data = res.data.data
      },
        (err) => {
          this.commonService.loading(false)
          this.commonService.handleError(err);
        }
      );
    });
  }

  /*
     Name: Expand collapse question answer
     Description: This function will expnd and collpase the question answe list
     */
  toggleAccordian(event, index) {
    var element = event.target;
    element.classList.toggle("active");
    if (this.data[index].isActive) {
      this.data[index].isActive = false;
    } else {
      this.data[index].isActive = true;
    }
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

}
