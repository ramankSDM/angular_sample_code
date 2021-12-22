import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { DataService } from "./../../../services/data.service";
import { environment } from 'src/environments/environment';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  providers: [NgbModal],
})
export class FooterComponent implements OnInit {
  selectedLang: any = 'en';
  closeResult: string;
  langs: any = [];
  modalOptions: NgbModalOptions;
  loginUser: any;
  hideFooter: boolean = false;
  fb_link: string = environment.FB_LINK;
  insta_link: string = environment.INSTA_LINK;
  twitter_link: string = environment.TW_LINK;
  linkedin_link: string = environment.LKDIN_LINK;
  constructor(private modalService: NgbModal, public ds: DataService,private translate: TranslateService) {
    this.ds.hideFooter.subscribe((data) => {
      data ? (this.hideFooter = true) : (this.hideFooter = false);
    });
  }

  ngOnInit() {
    this.loginUser = JSON.parse(localStorage.getItem("user-starsin"));
    this.ds.get().subscribe(async (data) => {
      if (data.key == "isLoggedInUser") {
        this.loginUser = JSON.parse(localStorage.getItem("user-starsin"));
      }
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

  setLang(lang) {
    this.selectedLang = lang
    this.translate.use(lang);
    localStorage.currentLang = lang;
    this.ds.set(lang, "currentLang");
  }

  /*signup Vendor popup calling*/
  signUpVendor() {
    // const modalRef = this.modalService.open(SignupVendorComponent, {
    //   windowClass: "modal-holder",
    // });
    // modalRef.componentInstance.title = "Signup Vendor";
  }

  open() {
  //   const modalRef = this.modalService.open(ContactUsComponent, {
  //     ariaLabelledBy: "modal-basic-title",
  //     windowClass: "modal-holder",
  //     centered: true,
  //   });
  //   modalRef.componentInstance.title = "Contact Us";
   }
}
