import { Component, OnInit, HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { SignupCelebrityComponent } from "./../../auth/signup-celebrity/signup-celebrity.component";
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CommonService } from "./../../shared/services/common.service";
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { SignupComponent } from "./../../auth/signup/signup.component";
import {  ActivatedRoute, Params, Router } from "@angular/router";
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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



export class HomeComponent implements OnInit {
  userReferralCode
  selectedLang: any = 'en';
  public show: boolean = false;
  name = "Angular";
  homeData: any = [];
  langs: any = [];
  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  // @ViewChild('slickModal') slickModal: SlickCarouselComponent;

  /*
   Name: Play video
   Description: play video on home page when hover over the thumbnail
   */
  playVideo(tgD, i) {
    const img = tgD.userData[0]._id + tgD._id + i;
    document.getElementById(img).style.display = 'none';
    const vid = i + tgD._id + tgD.userData[0]._id
    document.getElementById(vid).style.display = 'block';
    var myVideo: any = document.getElementById(vid);
    myVideo.play();
  }
  /*
   Name: Remove Video
   Description: Stop video & remove it back with image
   */
  removeVideo(tgD, i) {
    const img = tgD.userData[0]._id + tgD._id + i;
    const vid = i + tgD._id + tgD.userData[0]._id;
    document.getElementById(vid).style.display = 'none'
    document.getElementById(img).style.display = 'block';
    var myVideo: any = document.getElementById(vid);
    myVideo.pause();
  }
  // customOptions: OwlOptions = {
  //   nav: true,
  //   navText: ['<div class="prev-left"></div>', '<div class="nxt-right></div>"'],
  //   loop: false,
  //   autoplay: false,
  //   center: false,
  //   dots: false,
  //   autoHeight: true,
  //   autoWidth: true,
  //   animateOut: 'fadeOut',
  //   responsive: {
  //     0: {
  //       items: 1,
  //     },
  //     600: {
  //       items: 1,
  //     },
  //     1000: {
  //       items: 4,
  //     }
  //   }
  // }
  slides = [];
  slideConfig = {
    'slidesToShow': 4,
    'slidesToScroll': 1,
    'arrows': true,
    "nextArrow": '<div class="nxt-right"></div>',
    "prevArrow": '<div class="prev-left"></div>',
    'swipeToSlide': true,
    'infinite': false,
    "nav": true,
       responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4
        }
      },
      
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2
        }
      },
      
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1
        }
      },
      
    ]
  };
  
  slickInit(e) {
    console.log('slick initialized');
  }
  
  breakpoint(e) {
    console.log('breakpoint');
  }
  
  afterChange(e) {
    console.log('afterChange');
  }
  
  beforeChange(e) {
    console.log('beforeChange');
  }



  headerOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    animateOut: 'fadeOut',
   
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

  constructor(
    @Inject(DOCUMENT) document,
    public cs: CommonService,
    public ds: DataService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {
    this.modalOptions = {
      backdrop: "static",
      backdropClass: "customBackdrop",
    };
  }

  ngOnInit() {
     this.activatedRoute.params.subscribe((params: Params) => {
      this.userReferralCode = params['userReferralCode'];
      console.log("this.referralCode ", this.userReferralCode )
      if(this.userReferralCode){
        let obj ={
          title: "Signup",
          userReferralCode: params['userReferralCode']
        }
        const modalRef = this.modalService.open(SignupComponent, {
          windowClass: "modal-holder"
        });
        modalRef.componentInstance.dataList = obj;
      }
    });

    this.langs = [{ name: 'English', code: 'en' }, { name: 'Arabic', code: 'ar' }];
    this.selectedLang = localStorage.currentLang ? localStorage.currentLang : 'en' // Getting selected language
    this.ds.get().subscribe(async (data) => {
      if (data.key == "currentLang") {
        this.selectedLang = data.set;
        this.translate.use(this.selectedLang)
      }
    });
    this.getHomeTags();
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

  setLang(lang) {
    this.selectedLang = lang
    this.translate.use(lang);
    localStorage.currentLang = lang;
    this.ds.set(lang, "currentLang");

  }


  /*signup popup calling*/
  signUp() {
    const modalRef = this.modalService.open(SignupCelebrityComponent, {
      windowClass: "modal-holder",
    });
    modalRef.componentInstance.title = "Signup";
  }

  /*
   Name: Home Tags
   Description: Get the home page tags with celebrity in them order wise
   */
  getHomeTags() {
    this.cs.get("tags/get-home-tag").subscribe(
      async (res) => {
        this.homeData = res.data;
        console.log("this.homeData", this.homeData)
      },
      (error) => {
        console.log("error in deleting file");
      }
    );
  }
}
