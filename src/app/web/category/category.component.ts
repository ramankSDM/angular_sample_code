import { Component, OnInit, HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { SignupCelebrityComponent } from "./../../auth/signup-celebrity/signup-celebrity.component";
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CommonService } from "./../../shared/services/common.service";

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { DataService } from "../../services/data.service";
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [NgbModal],
  animations: [
    trigger('fade',
      [
        state('void', style({ opacity: 0 })),
        transition(':enter', [animate(300)]),
        transition(':leave', [animate(500)]),
      ]
    )]
})
export class CategoryComponent implements OnInit {
  selectedLang: any = 'en';
  public show: boolean = false;
  name = "Angular";
  homeData: any = [];
  totalRecords: number = 0;
  public activePage: number = 1;
  slug: String;
  featured: any = [];
  newCategory: any = [];
  catDetail: any;
  filterStatus: any;
  filterRating: any;
  filterService: any;
  filterPrice: any;
  minPrice: any;
  maxPrice: any;
  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;

  customOptions: OwlOptions = {
    nav: true,
    navText: ['<div class="prev-left"></div>', '<div class="nxt-right></div>"'],
    loop: true,
    autoplay: false,
    center: false,
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
        items: 2,
      }
    }
  }
  headerOptions: OwlOptions = {
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
  modalOptions: NgbModalOptions;
  constructor(@Inject(DOCUMENT) document,
    public cs: CommonService,
    public ds: DataService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal) {
    this.modalOptions = {
      backdrop: "static",
      backdropClass: "customBackdrop",
    };
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.slug = params['slug'];
      this.getHomeTags();
    });
    this.selectedLang = localStorage.currentLang ? localStorage.currentLang : 'en' // Getting selected language
    this.ds.get().subscribe(async (data) => {
      if (data.key == "currentLang") {
        this.selectedLang = data.set;
      }
    });
    const pageWidth = window.innerWidth;
    if (pageWidth < 768) {
      document.getElementsByTagName('body')[0].classList.add('sidebarCollapsed');
    }
  }
  sidebarToggle(){
    document.getElementsByTagName('body')[0].classList.toggle('sidebarCollapsed');
  }
  sidebarMobileToggle() {
    document.getElementsByTagName('body')[0].classList.remove('sidebarCollapsed');
    document.getElementsByTagName('body')[0].classList.add('hidden'); 
    document.getElementsByClassName('back-div')[0].classList.add('show'); 
  }
  closeFilter(){
    document.getElementsByClassName('back-div')[0].classList.remove('show');
    document.getElementsByTagName('body')[0].classList.add('sidebarCollapsed');
    document.getElementsByTagName('body')[0].classList.remove('hidden');  
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset > 550) {
      let element = document.getElementById('myheader');
      element.classList.add('sticky');
    } else {
      let element = document.getElementById('myheader');
      element.classList.remove('sticky');
    }
  }

  /*
  Name: getHomeTags
  Description: Get list of browse category.
  */
  getHomeTags() {
    let path = `category/browse-category`;
    let options = {
      page: this.activePage,
      slug: this.slug,
      filter: (this.filterStatus != undefined) ? this.filterStatus : '',
      minPrice: (this.minPrice != undefined) ? this.minPrice : '',
      maxPrice: (this.maxPrice != undefined) ? this.maxPrice : '',
      service: (this.filterService != undefined) ? this.filterService : '',
      rating: (this.filterRating!= undefined) ? this.filterRating : ''
    };
   
    this.cs.queryParams(path, options).subscribe(
      async (res) => {
        this.catDetail = res.data.allData[0];
        this.totalRecords = res.data.total;
        this.homeData = res.data.allData[0]['userSelected'];
        this.featured = res.data.featured[0]['userSelected'];
        this.newCategory = res.data.newArrival[0]['userSelected'];
        console.log(this.newCategory)
      },
      (error) => {
      }
    );
  }

  /*
  Name: pageChanged
  Description: when change the page from pagination,it will get new page records
  */
  pageChanged(event: any): void {
    this.activePage = event.page;
    this.getHomeTags();
  }

  /*
  Name: clear
  Description: clear all the slected filter and get records
  */
  clear() {
    this.filterStatus = '';
    this.filterPrice = '';
    this.minPrice = '';
    this.maxPrice = '';
    this.filterRating = '';
    this.filterService = '';
    this.getHomeTags();
  }

  clearSort() {
    this.filterStatus = '';
    this.getHomeTags();
  }

  clearPrice() {
    this.filterPrice = '';
    this.minPrice = '';
    this.maxPrice = '';
    this.getHomeTags();
  }

  clearRating() {
    this.filterRating = '';
    this.getHomeTags();
  }

  clearService() {
    this.filterService = '';
    this.getHomeTags();
  }

  filterRecords() {
    if (this.filterPrice == 1) {
      this.minPrice = 0;
      this.maxPrice = 100;
    }
    if (this.filterPrice == 2) {
      this.minPrice = 100;
      this.maxPrice = 200;
    }
    if (this.filterPrice == 3) {
      this.minPrice = 200;
      this.maxPrice = 300;
    }
    if (this.filterPrice == 4) {
      this.minPrice = 300;
      this.maxPrice = 400;
    }
    if (this.filterPrice == 5) {
      this.minPrice = 400;
      this.maxPrice = 5000;
    }
    this.getHomeTags();
  }

}
