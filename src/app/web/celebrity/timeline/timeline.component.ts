import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  loginUser: any;
  dedicatedServicesList: any;
  talentServicesList: any;
  fan: any;
  selectedLang: any = 'en';
  langs: any = [];
  isLikeButtonShow: boolean = false;
  constructor(public router: Router,private activatedRoute: ActivatedRoute,private spinner: NgxSpinnerService,private _cookieservice: CookieService,private toastr: ToastrService, private commonService: CommonService,
    private translate: TranslateService,public ds: DataService) { }

  ngOnInit(){
    this.loginUser = JSON.parse(this._cookieservice.get("user-starsin"));
    if (!this.loginUser || this.loginUser != '') {
      this.isLikeButtonShow = false;
    }
    this.getProfile();
    this.getBookings(1,5); //Request Type(1):ShoutOut and Status(5):Completed
    this.gotTalentBookings(2,5); //Request Type(2):i-gottalent and Status(5):Completed

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
  Name: playVideo
  Description: Play the video when mouse focus on celebrity image
  */
  playVideo(ds,i) {
    const vid=i+ds._id;
    const videoImgId = 'videoImg'+vid;
    const myVideoId = 'my_video'+vid;
    var myVideo: any = document.getElementById(myVideoId);
    var celebVideo: any = document.getElementById(vid);
    myVideo.style.display = 'block';
    document.getElementById(videoImgId).style.display = 'none';
    celebVideo.play();
  }

  /*
  Name: removeVideo
  Description: Pause the video when mouse focus out celebrity image
  */
  removeVideo(ds,i) {
    const vid=i+ds._id;
    const videoImgId = 'videoImg'+vid;
    const myVideoId = 'my_video'+vid;
    var myVideo: any = document.getElementById(myVideoId);
    var celebVideo: any = document.getElementById(vid);
    document.getElementById(videoImgId).style.display = 'block';
    myVideo.style.display = 'none';
    celebVideo.pause();
  }

  /*
  Name: toggleVideoMute
  Description: Mute un-mute the video
  */
  muted = false;
  toggleVideoMute(ds,i) {
    const vid=i+ds._id;
    let audioPlayer = <HTMLVideoElement>document.getElementById(vid);
    if (audioPlayer.muted === true) {
      audioPlayer.muted = false;
      this.muted = false;
    } else {
      audioPlayer.muted = true;
      this.muted = true;
    }
  }

  /*
  Name: activeTab
  Description: Show active tab
  */
  activeTab(e, id, divclass, liParent) {
    const elems = (<any>document.querySelectorAll('.' + divclass));
    for (var i = 0, l = elems.length; i < l; i++) {
      elems[i].style["display"] = "none";
    }
    document.getElementById(id).style.display = 'block';
    const liElem = (<any>document.querySelectorAll('.' + liParent + ' ul li'));
    for (var i = 0, l = liElem.length; i < l; i++) {
      liElem[i].classList.remove('active');
    }
    e.target.classList.add('active');
  }

  /*
  Name: getProfile
  Description: Get full profile info
  */
  getProfile(){
    let apiPath = `user/get-profile`;
    this.commonService.get(apiPath).subscribe(result => {
      this.fan = result.data;     
      if (this.loginUser && this.loginUser != '') {
        this.isLikeButtonShow = true;
      } else {
        this.isLikeButtonShow = false;
      }
    }, err => {
      this.commonService.handleError(err);
    });
  }

  /*
  Name: getBookings
  Description: Get bokings
  */
  getBookings(reuestType,status){    
    this.spinner.show();
      let path = `booking/fan-bookings`;
      let options = {
        requestType: reuestType,
        status: status
      };      
      this.commonService.queryParams(path, options).subscribe(response => {
        this.spinner.hide();
        this.dedicatedServicesList = response.data;   
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      });     
  }

  /*
  Name: gotTalentBookings
  Description: Get i-got talent bookings
  */
  gotTalentBookings(reuestType,status){    
    this.spinner.show();
      let path = `booking/fan-bookings`;
      let options = {
        requestType: reuestType,
        status: status
      };      
      this.commonService.queryParams(path, options).subscribe(response => {
        this.spinner.hide();
        this.talentServicesList = response.data;   
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      });     
  }

  playTestVideo() { //will delete it after webinar services, used in html
    var myVideo: any = document.getElementById("my_video_1");
    var celebVideo: any = document.getElementById("celeb-video");
    myVideo.style.display = 'block';
    document.getElementById('videoImg').style.display = 'none';
    celebVideo.play();
  }
  removeTestVideo() { //will delete it after webinar services, used in html
    var myVideo: any = document.getElementById("my_video_1");
    var celebVideo: any = document.getElementById("celeb-video");
    document.getElementById('videoImg').style.display = 'block';
    myVideo.style.display = 'none';
    celebVideo.pause();
  }
  toggleTestVideoMute() { //will delete it after webinar services, used in html
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
  Name: timelineDetail
  Description: Get timeline detail
  */
  timelineDetail(data) {
    this.router.navigate(['/celebrity/timeline-detail/'+data._id])
  }

  /*
  Name: copyText
  Description: Copy the text from page
  */
  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  /*
  Name: downloadFile
  Description: Download the file
  */
  downloadFile(fileLink) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', fileLink);

    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
