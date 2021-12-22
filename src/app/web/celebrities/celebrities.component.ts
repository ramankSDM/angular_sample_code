import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, HostListener } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgbModal, ModalDismissReasons, NgbModalOptions, } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ShoutoutComponent } from "./../_model/shoutout/shoutout.component"
import { AllReviewsComponent } from "./../_model/all-reviews/all-reviews.component"
import { environment } from 'src/environments/environment';
import { IotComponent } from '../_model/iot/iot.component';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LoginComponent } from "./../../auth/login/login.component";
import { CookieService } from 'ngx-cookie';
import { ZoomCallComponent } from "./../_model/zoom-call/zoom-call.component"
import { DmComponent } from "./../_model/dm/dm.component"

import { DataService } from "../../services/data.service";
import {msgList} from "../../shared/_json_files/constant";
import { from } from 'rxjs';
@Component({
  selector: 'app-celebrities',
  templateUrl: './celebrities.component.html',
  styleUrls: ['./celebrities.component.scss'],
  providers: [NgbModal],
})
export class CelebritiesComponent implements OnInit {
  selectedLang: any = 'en';
  langs: any = [];
  slug: any;
  mediaCss = false;
  modalOptions: NgbModalOptions;
  dataList: any;
  fanClub = 'false';
  celebInfo: any;
  fanInfo: any;
  serviceList: any = []
  catEnList: any = []
  catArList: any = []
  catEn: any = []
  catAr: any = []
  tagList: any = []
  requestType = 1
  timeLineData: any = [];
  gotTalentData: any = [];
  gotTalentCount: number = 0;
  shoutOutCount: number = 0;
  dmCount: number = 0;
  dmList: any = [];
  isLikeButtonShow: boolean = false;
  showLikes: boolean = true;
  loginUserData: any;
  reviewList: any;
  testimonialList: any;
  webinarsList:any = [];
  isCelebrity: boolean = false;
  loggedInFUser:any;
  tipMsgList = msgList;
  currentUser:any;
  muted = false;
  

  @Input() selected: boolean = true;
  @Output() selectedChange = new EventEmitter<boolean>();

  constructor(private spinner: NgxSpinnerService, private _cookieservice: CookieService, private modalService: NgbModal, private nbModalService: NgbModal,
    private toastr: ToastrService, public ds: DataService, private activatedRoute: ActivatedRoute, private translate: TranslateService, private commonService: CommonService
  ) {
    this.fanInfo = '';
  }

  ngOnInit(): void {
    this.loginUserData = this._cookieservice.get('user-starsin');
	
	// this.currentUser = JSON.parse(this.loginUserData);
	// if(this.currentUser.role == 3){
	// 		this.isCelebrity = true;
	// 	}
	
	// console.log("this.loginUserData ", this.loginUserData)
	// console.log("this.loginUserData role ", this.loginUserData.role);
	
    if (!this.loginUserData || this.loginUserData != '') {
      this.isLikeButtonShow = false;
    }


    this.activatedRoute.params.subscribe((params: Params) => {
      this.slug = params['slug'];
    });

  //   let aPath = `celebrity/${this.slug}`;
  //   this.commonService.get(aPath).subscribe(response => {
	// 	console.log("response.data ", response.data)
		
  //     this.celebInfo = response.data[0].trim;
  //     let celebrityInfo = JSON.stringify(this.celebInfo);
  //     this.loggedInFUser = JSON.parse(celebrityInfo); 
  //     let loginUser;
  //     //console.log('this.loginUserData',this.loginUserData)
  //     if (this.loginUserData) {
  //       loginUser = JSON.parse(this.loginUserData);
		
	// 	console.log("loginUser ", loginUser)
	// console.log("loginUser role ", loginUser.role)
		
  //       //console.log('herere',this.loggedInFUser._id,loginUser._id)
  //       if(this.loggedInFUser._id == loginUser._id){
  //         this.isCelebrity = true;
  //       } 
  //     }   
  let aPath = `celebrity/${this.slug}`;
    this.commonService.get(aPath).subscribe(response => {
      this.celebInfo = response.data[0]
      let celebrityInfo = JSON.stringify(this.celebInfo);
      this.loggedInFUser = JSON.parse(celebrityInfo); 
      let loginUser;
      //console.log('this.loginUserData',this.loginUserData)
      if (this.loginUserData) {
        loginUser = JSON.parse(this.loginUserData)
        //console.log('herere',this.loggedInFUser._id,loginUser._id)
        if(this.loggedInFUser._id == loginUser._id){
          this.isCelebrity = true;
        } 
      }

    });     

    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.joiningFanClub == "true") {
        let path = `celebrity/${this.slug}`;
        this.commonService.get(path).subscribe(response => {
          this.celebInfo = response.data[0];
          let celebrityInfo = JSON.stringify(this.celebInfo);
          let NewCFUser = JSON.parse(celebrityInfo);
          this.spinner.show(); 
          if (NewCFUser.isFan == 'false') {
            let fanPath = `fanclub/add`;
            let json = {
              celebrity_id: NewCFUser._id
            };
            this.commonService.post(fanPath, json).subscribe(response => {
              this.toastr.success('Joined successfully');
              this.spinner.hide();
              this.fanClub = 'true';
              this.dataList.isFan = 'true';
              let fanFullInfo = JSON.stringify(response);
              this.fanInfo = JSON.parse(fanFullInfo);
              // this.ngOnInit()
            }, err => {
              this.spinner.hide();
              this.commonService.handleError(err);
            });
          } else {
            this.toastr.success('Already Joined');
            this.spinner.hide();
          }
        });
      }
    });     

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
    this.getAll()
    this.getWebinars();

  }

  trackByPeople(index: number, person: any) {
    return person.id;
  }

  /*
  Name: getAll
  Description: Get list of Celebrities.
  */
  getAll() {
    this.spinner.show();    
    let path = `celebrity/${this.slug}`;
    this.commonService.get(path).subscribe( async response => {
      this.dataList = response.data[0];
      this.tagList=[]
      this.catEn=[]
      this.catAr=[]   
      await this.dataList.categoriesData.map(element => {
        this.catEn.push(element.categories[0].category_name_en)
        this.catAr.push(element.categories[0].category_name_ar)
      });
      let avgRating = this.dataList.averageRating;
   
      if(avgRating > 0){        
        this.dataList.rating = avgRating.toFixed(2);
        


      } else{
        this.dataList.rating = avgRating;
       

      }
      if (this.dataList.isFan == true) {
        this.fanClub = 'true';
      }     
      this.catEnList = this.catEn.join()
      // console.log('Cat List', this.catEnList, this.catEn,this.dataList);
      this.catArList = this.catAr.join()
      this.dataList.tagData.map(element => {
        let obj = {
          title_en: element.tags[0].title_en,
          title_ar: element.tags[0].title_ar,
          slug: element.tags[0].slug
        }
        this.tagList.push(obj)
      });

      let service = '';
      service = this._cookieservice.get('service');

      if (service == "shoutout") {
        this.shoutOut();
      }

      if (service == "igottalent") {
        this.iot();
      }
      this.loginUserData = this._cookieservice.get('user-starsin');
      let loginUser;
      if (this.loginUserData) {
        loginUser = JSON.parse(this.loginUserData)
      }
      if (this.loginUserData && this.loginUserData != '' && this.loginUserData._id != this.dataList._id && loginUser.role == 2) {
        this.isLikeButtonShow = true;
        this.showLikes = false;
      } else {
        this.isLikeButtonShow = false;
        this.showLikes = true;
      }
      this.getCelTimeline();
      this.getGotTalentTimeline();
      this.getTestimonials();
      this.getDmTextData(this.dataList._id);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: getWebinars
  Description: Get list of Celebrity webinars.
  */
  getWebinars() {
    // console.log('sluggg',this.slug);
    let path = `celebrity/${this.slug}`;
    this.commonService.get(path).subscribe(response => {
        this.celebInfo = response.data[0];
        let celebrityInfo = JSON.stringify(this.celebInfo);
        let NewCFUser = JSON.parse(celebrityInfo);
        let apiPath = `celebrities/get-webinar`; 
        let options = {
          page: 1,
          count: 100,
          search: '',
          sortBy: '_id',
          sort: '',
          status:true,
          celebrity_id:NewCFUser._id
        };
        this.commonService.queryParams(apiPath, options).subscribe(response => {      
          this.webinarsList = response.data.data;           
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.commonService.handleError(err);
        });
    });
  }
  // playVideo(ds,i) {
  //   const vid=i+ds._id;
  //   const videoImgId = 'videoImg'+vid;
  //   const myVideoId = 'my_video'+vid;
  //   var myVideo: any = document.getElementById(myVideoId);
  //   var celebVideo: any = document.getElementById(vid);
  //   myVideo.style.display = 'block';
  //   document.getElementById(videoImgId).style.display = 'none';
  //   celebVideo.play();
  // }
  // removeVideo(ds,i) {
  //   const vid=i+ds._id;
  //   const videoImgId = 'videoImg'+vid;
  //   const myVideoId = 'my_video'+vid;
  //   var myVideo: any = document.getElementById(myVideoId);
  //   var celebVideo: any = document.getElementById(vid);
  //   document.getElementById(videoImgId).style.display = 'block';
  //   myVideo.style.display = 'none';
  //   celebVideo.pause();
  // }

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

    // var myVideo: any = document.getElementById("my_video_1");
    // var celebVideo: any = document.getElementById("celeb-video");
    // myVideo.style.display = 'block';
    // document.getElementById('videoImg').style.display = 'none';
    // celebVideo.play();
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


    // var myVideo: any = document.getElementById("my_video_1");
    // var celebVideo: any = document.getElementById("celeb-video");
    // document.getElementById('videoImg').style.display = 'block';
    // myVideo.style.display = 'none';
    // celebVideo.pause();
  }

  // toggleVideoMute(ds,i) {
  //   const vid=i+ds._id;
  //   let audioPlayer = <HTMLVideoElement>document.getElementById(vid);
  //   if (audioPlayer.muted === true) {
  //     audioPlayer.muted = false;
  //     this.muted = false;
  //   } else {
  //     audioPlayer.muted = true;
  //     this.muted = true;
  //   }
  // }
  toggleVideoMute() {
    if (this.muted === true) {
      this.muted = false;
    } else {
      this.muted = true;
    }
  }

  /*
  Name: activeTab
  Description: Show active tab
  */
  activeTab(e, id, divclass, liParent, requestType) {
    this.requestType = requestType;
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
    // this.getCelTimeline();
  }

  activeTab1(e, id, divclass, liParent, requestType) {
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
  Name: shoutOut
  Description: Open Shoutout popup
  */
  shoutOut() {
    this.spinner.hide();
    let CFUser = this._cookieservice.get('user-starsin');
    if (!CFUser) {
      this._cookieservice.put('service', 'shoutout');
      const modalRef = this.modalService.open(LoginComponent, {
        backdrop: 'static',
        keyboard: false,
        windowClass: "modal-holder",
      });
      modalRef.componentInstance.title = "Login";
      this.spinner.hide();
    } else {
      this.spinner.hide();
      var obj = {
        fname_en: this.dataList.fname_en,
        fname_ar: this.dataList.fname_ar,
        lname_en: this.dataList.lname_en,
        lname_ar: this.dataList.lname_ar,
        _id: this.dataList._id,
        email: this.dataList.email,
        image: this.dataList.image,
        totalAmount: this.dataList.dedicated_price,
        lang: this.dataList.lang,
      }
      const modalRef = this.nbModalService.open(ShoutoutComponent, {
        windowClass: "modal-holder",
        backdrop: 'static',
        keyboard: false,
      });
      modalRef.componentInstance.dataList = obj;
    }
  }

  /*
  Name: iot
  Description: Open Iot popup
  */
  iot() {
    this.spinner.show();
    let CFUser = this._cookieservice.get('user-starsin');
    if (!CFUser) {
      this._cookieservice.put('service', 'igottalent');
      const modalRef = this.modalService.open(LoginComponent, {
        backdrop: 'static',
        keyboard: false,
        windowClass: "modal-holder",
      });
      modalRef.componentInstance.title = "Login";
      this.spinner.hide();
    } else {
      this.spinner.hide();
      var obj = {
        fname_en: this.dataList.fname_en,
        fname_ar: this.dataList.fname_ar,
        lname_en: this.dataList.lname_en,
        lname_ar: this.dataList.lname_ar,
        _id: this.dataList._id,
        email: this.dataList.email,
        image: this.dataList.image,
        totalAmount: this.dataList.dedicated_price,
        lang: this.dataList.lang,
      }
      const modalRef = this.nbModalService.open(IotComponent, {
        backdrop: 'static',
        keyboard: false,
        windowClass: "modal-holder",
      });
      modalRef.componentInstance.dataList = obj;
    }

  }



  mediaFunction(mediaCssChange) {
    this.mediaCss = !mediaCssChange;
  }

  /*
  Name: becomeFan
  Description: When click on become fan button on celebrity detail page
  */
  becomeFan(id) {
    let CFUser = this._cookieservice.get('user-starsin');
    if (!CFUser) {
      const modalRef = this.modalService.open(LoginComponent, {
        backdrop: 'static',
        keyboard: false,
        windowClass: "modal-holder",
      });
      modalRef.componentInstance.title = "Login";
    } else {
      this.spinner.show();
      let fanPath = `fanclub/add`;
      let json = {
        celebrity_id: id
      };
      this.commonService.post(fanPath, json).subscribe(response => {
        let fanFullInfo = JSON.stringify(response);
        this.fanInfo = JSON.parse(fanFullInfo);
        this.toastr.success('Joined successfully');
        this.spinner.hide();
        this.fanClub = 'true';
        this.dataList.isFan = 'true';
        this.ngOnInit()
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      });
    }
  }

  /*
  Name: removeFan
  Description: When click on un-follow fan button on celebrity detail page
  */
  removeFan(id) {
    this.spinner.show();
    let path = `fanclub/delete/` + id;
    this.commonService.delete(path).subscribe(response => {
      this.spinner.hide();
      this.toastr.success('Successfully removed');    
      this.fanClub = 'false';
      this.dataList.isFan = 'false';
      this.ngOnInit()
     
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });

  }

  /*
  Name: bookZoom
  Description: When click on Request a zoom button on celebrity detail page
  */
  bookZoom() {
    this.spinner.show();
    let CFUser = this._cookieservice.get('user-starsin');
    if (!CFUser) {
      this._cookieservice.put('service', 'zoomcall');
      const modalRef = this.modalService.open(LoginComponent, {
        backdrop: 'static',
        keyboard: false,
        windowClass: "modal-holder",
      });
      modalRef.componentInstance.title = "Login";
      this.spinner.hide();
    } else {
      let apiPath = `booking/get-meeting-count`;
      this.commonService.get(apiPath).subscribe(result => {
        this.spinner.hide();
        if (result.data.available == true) {
          var obj = {
            _id: this.dataList._id,
            image: this.dataList.image,
            name: this.dataList.fname_en,
            timezone: this.dataList.timezone,
            price: this.dataList.connect_on_zoom_price
          }
          const modalRef = this.nbModalService.open(ZoomCallComponent, {
            windowClass: "modal-holder zoom_modal",
            backdrop: 'static',
            keyboard: false,
          });
          modalRef.componentInstance.dataList = obj;
        } else {
          this.toastr.error('Sorry! No user availablity.');
        }
      }, err => {
        this.commonService.handleError(err);
      });
    }
  }

  /*
  Name: getCelTimeline
  Description: Get Celebrity timeline
  */
  getCelTimeline() {
    let fanid = '';
    if (this.loginUserData && this.loginUserData != '') {
      let d = JSON.parse(this.loginUserData);
      fanid = d._id
    }
    let obj = {
      requestType: 1,
      id: this.dataList._id,
      fanId: fanid
    }
    let path = `booking/celebrity-timeline`;
    this.commonService.queryParams(path, obj).subscribe(response => {
      this.timeLineData = response.data.data;
      this.shoutOutCount = response.data.shoutOutCount;
      this.gotTalentCount = response.data.gotTalentCount;
      // console.log(this.shoutOutCount)
      
      
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: getGotTalentTimeline
  Description: Get Got Talent timeline info
  */
  getGotTalentTimeline() {
    let fanid = '';
    if (this.loginUserData && this.loginUserData != '') {
      let d = JSON.parse(this.loginUserData);
      fanid = d._id
    }
    let obj = {
      requestType: 2,
      id: this.dataList._id,
      fanId: fanid
    }
    let path = `booking/celebrity-timeline`;
    this.commonService.queryParams(path, obj).subscribe(response => {
      this.gotTalentData = response.data.data;
      this.shoutOutCount = response.data.shoutOutCount;
      this.gotTalentCount = response.data.gotTalentCount;
      // console.log(this.gotTalentCount);
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
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

  /*
  Name: getReview
  Description: Get Review of request
  */
  getReview() {
    this.spinner.show();
    let obj = {
      page: 1,
      count: 10,
      id: this.dataList._id
    }
    let path = `booking/getReview`;
    this.commonService.queryParams(path, obj).subscribe(response => {
      this.reviewList = response.data;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: allReview
  Description: Get list of all reviews
  */
  allReview() {
    let obj = {
      id: this.dataList._id,
      slug: this.slug
    }
    const modalRef = this.nbModalService.open(AllReviewsComponent, {
      backdrop: 'static',
        keyboard: false,
        windowClass: "modal-holder",      
    });
    modalRef.componentInstance.celData = obj;
  }

  /*
  Name: getTestimonials
  Description: Get list of all testimonials
  */
  getTestimonials() {
    this.spinner.show();
    let obj = {
      page: 1,
      count: 6,
      id: this.dataList._id
    }
    let path = `testimonial/getTimelineTestimonial`;
    this.commonService.queryParams(path, obj).subscribe(response => {
      this.testimonialList = response.data.data;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
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
  Name: likeUnlike
  Description: Like un-like the request
  */
  likeUnlike(id, status) {
    this.spinner.show();
    let obj = {
      bookingId: id,
      status: (status == true) ? false : true
    }
    let path = `like/like-booking`;
    this.commonService.post(path, obj).subscribe(response => {
      if (status == true) {
        this.toastr.success('Un-like successfully')
      } else {
        this.toastr.success('Like successfully')
      }
      this.getAll()
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });

  }

  /*
  Name: dmText
  Description: When click on Request a zoom button on celebrity detail page
  */
  dmText() {
    this.spinner.show();
    let CFUser = this._cookieservice.get('user-starsin');
    if (!CFUser) {
      this._cookieservice.put('service', 'zoomcall');
      const modalRef = this.modalService.open(LoginComponent, {
        backdrop: 'static',
        keyboard: false,
        windowClass: "modal-holder",
      });
      modalRef.componentInstance.title = "Login";
      this.spinner.hide();
    } else {
      var obj = {
        _id: this.dataList._id,
        image: this.dataList.image,
        name: this.dataList.fname_en,
        price: this.dataList.dm_text_price       
      }      
      const modalRef = this.nbModalService.open(DmComponent, {
        windowClass: "modal-holder zoom_modal",
        backdrop: 'static',
        keyboard: false,
      });
      modalRef.componentInstance.dataList = obj;      
    }
  }

    /*
  Name: getDmTextData
  Description: Get DM text public messages
  */
  getDmTextData(celebId) {    
    let options = {
      celebrity_id: celebId,
      requestType : 5
    };
    let path = `celebrities/get-messages`;
    this.commonService.queryParams(path, options).subscribe(response => {
      this.dmList = response.data;
      this.dmCount = response.data.length;  

    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
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
}