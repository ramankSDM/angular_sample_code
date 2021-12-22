import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "./shared/services/common.service"
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

import { OwlOptions } from 'ngx-owl-carousel-o';

import { TranslateService } from "@ngx-translate/core";
export interface PhotosApi {
    albumId?: number;
    id?: number;
    title?: string;
    url?: string;
    thumbnailUrl?: string;
  }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'StarsIn';
  public isLoading: boolean = false;
  public showLoader: boolean = false

  apiData: PhotosApi;
  limit: number = 10; // <==== Edit this number to limit API results
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  }

  constructor(
      private readonly http: HttpClient,
      private spinner: NgxSpinnerService,
      private translate: TranslateService,
      private cs: CommonService) {
      this.cs.isLoading.subscribe(value => {
          const userType = JSON.parse(localStorage.getItem('user-starsin'));
          if (userType && (userType.role == "1" || userType.role == "2")) {
              this.showLoader = true
          }
          else if (!userType || (userType && userType.role == "3")) {
              this.showLoader = false
          }
          if (value) this.spinner.show();
          else this.spinner.hide();
      });
  }

  ngOnInit() {
    this.translate.addLangs(["en", "ar"]);
    this.translate.setDefaultLang('en');
    if (localStorage.currentLang) {
      var selectedLang = localStorage.currentLang;
      this.translate.setDefaultLang(selectedLang);
      this.translate.use(selectedLang);
    }
    else {
      let browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
      localStorage.currentLang = this.translate.currentLang;
    }
    this.fetch()
  }
  loadStripe() {}
  fetch() {
    const api = `https://jsonplaceholder.typicode.com/albums/1/photos?_start=0&_limit=${this.limit}`;
    const http$ = this.http.get<PhotosApi>(api);

    http$.subscribe(
      res => this.apiData = res,
      err => throwError(err)
    )
  }

}


  