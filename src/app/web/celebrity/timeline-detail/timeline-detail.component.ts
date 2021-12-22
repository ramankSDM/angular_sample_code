import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Track } from 'ngx-audio-player';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-timeline-detail',
  templateUrl: './timeline-detail.component.html',
  styleUrls: ['./timeline-detail.component.scss']
})
export class TimelineDetailComponent implements OnInit {
  bookingId: string;
  bookingData: any = {};

  msaapDisplayTitle = true;
  msaapDisplayPlayList = true;
  msaapPageSizeOptions = [2, 4, 6];
  msaapDisplayVolumeControls = true;
  msaapDisablePositionSlider = true;
  pageSizeOptions = [2, 4, 6];
  msaapPlaylist: Track[] = [
    {
      title: 'Audio One Title',
      link: 'https://geekanddummy.com/wp-content/uploads/2014/02/ambient-noise-server-room.mp3'
    }
  ];

  customOptions: OwlOptions = {
    nav: true,
    navText: ['<div class="prev-left"></div>', '<div class="nxt-right></div>"'],
    loop: false,
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
        items: 1,
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
  constructor(public router: Router, private activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService, private _cookieservice: CookieService, private toastr: ToastrService, private commonService: CommonService) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.bookingId = params['id'];      
    });
  }

  ngOnInit(): void {
    this.getBookingDetail();
  }

  /*
  Name: getBookingDetail
  Description: Get timeline full detail
  */
  getBookingDetail() {
    let apiPath = `booking/get-by-id/${this.bookingId}/1`;  

    return new Promise((resolve, reject) => {
      this.commonService.get(apiPath).subscribe(result => {
        this.bookingData = result.data;
        if(this.bookingData.talentType == 'mp3') {
          this.msaapPlaylist = [
            {
              title: 'Audio Request',
              link: this.bookingData.talentMp3
            }
          ]
        }
      }, err => {
        this.commonService.handleError(err);
      });
    });    
  }

  onEnded(event) {

  }
}
