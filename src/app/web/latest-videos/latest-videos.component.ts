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
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-latest-videos',
  templateUrl: './latest-videos.component.html',
  styleUrls: ['./latest-videos.component.scss'],
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
export class LatestVideosComponent implements OnInit {
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
 
  langs: any = [];
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
    private activatedRoute: ActivatedRoute,private translate: TranslateService, 
    private modalService: NgbModal) {
    this.modalOptions = {
      backdrop: "static",
      backdropClass: "customBackdrop",
    };

    
  }

  ngOnInit(): void {
    this.getHomeTags();
    const pageWidth = window.innerWidth;
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
    let path = `booking/get-latest-videos`;
    let options = {
      page: this.activePage,
      count: 10
    };
    this.cs.queryParams(path, options).subscribe(
      async (res) => {
        console.log('ress', res.data.data)
        this.totalRecords = res.data.total;
        this.homeData = res.data.data;
      },
      (error) => {
      }
    );
  }

  /*
 Name: playVideo
 Description: Play the video when mouse focus on celebrity image
 */
  playVideo(tdata, i) {
    const img = tdata.receiverData._id + tdata._id + i;
    document.getElementById(img).style.display = 'none';
    const div = 'celeb-video' + tdata._id + i;
    const vid = i + tdata._id + tdata.receiverData._id
    document.getElementById(vid).style.display = 'block';
    document.getElementById(div).style.display = 'block';
    var myVideo: any = document.getElementById(div);
    myVideo.play();
  }

  /*
    Name: removeVideo
    Description: Pause the video when mouse focus out celebrity image
    */
  removeVideo(tdata, i) {
    const img = tdata.receiverData._id + tdata._id + i;
    const vid = i + tdata._id + tdata.receiverData._id;
    const div = 'celeb-video' + tdata._id + i;
    document.getElementById(vid).style.display = 'none'
    document.getElementById(div).style.display = 'none'
    document.getElementById(img).style.display = 'block';
    var myVideo: any = document.getElementById(div);
    myVideo.pause();
  }
  
  muted = false;
  toggleVideoMute() {
    let audioPlayer = <HTMLVideoElement>document.getElementById('celeb-video');
    if (audioPlayer.muted === true) {
      audioPlayer.muted = false;
      this.muted = false;
    } else {
      audioPlayer.muted = true;
      this.muted = true;
    }
  }
  /*
  Name: pageChanged
  Description: when change the page from pagination,it will get new page records
  */
  pageChanged(event: any): void {
    this.activePage = event.page;
    this.getHomeTags();
  }


}

