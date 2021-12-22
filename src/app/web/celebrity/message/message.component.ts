import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/services/data.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  modalRef: BsModalRef;
  dataList: any;
  selectedLang: any = 'en';
  langs: any = [];
  title: any;
  itemValue: any;
  totalRecords: any;
  page: number;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  
  constructor(private spinner: NgxSpinnerService, private modalService: BsModalService, private _cookieservice: CookieService, private toastr: ToastrService, private router: Router, private commonService: CommonService,private translate: TranslateService, public ds: DataService
    ) {
    this.page = 1;
    this.dataList = [];
  }

  ngOnInit(): void {
    this.getMessages();
    // change language code
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
  Name: getMessages
  Description: Get list of all messages
  */
  getMessages() {
    this.spinner.show();
    let path = `testimonial/get-all`;
    let options = {
      page: this.activePage,
      count: this.rowsOnPage
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
  Name: pageChanged
  Description: when change the page from pagination,it will get new page records
  */
  pageChanged(event: any): void {
    this.page = event.page;
    this.getMessages();
  }

  /*
  Name: publishMessage
  Description: Change status of message to publish or un-publish
  */
  publishMessage(id, status) {
    this.spinner.show();
    let path = `testimonial/updateStatus`;
    let options = {
      id: id,
      status: status
    };
    this.commonService.put(path, options).subscribe(response => {
      if (status == true) {
        this.toastr.success('Successfully Published');
      } else {
        this.toastr.success('Successfully Un-Published');
      }
      this.getMessages();
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }


}
