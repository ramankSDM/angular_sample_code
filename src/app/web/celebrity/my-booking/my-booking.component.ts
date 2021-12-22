import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { Track } from 'ngx-audio-player';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {media} from "../../../shared/_json_files/constant"
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';
import {selectDays} from "../../../shared/_json_files/constant"


@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.component.html',
  styleUrls: ['./my-booking.component.scss']
})
export class MyBookingComponent implements OnInit {
  reason : any
  dayList = selectDays
  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  modalRef2: BsModalRef;
  selectedLang: any = 'en';
  langs: any = [];
  postponeDays: any;
  postponeError: boolean = false;
  fanBlockList: any
  dataList: any;
  title: any;
  itemValue: any;
  viewData: any;
  totalRecords: any;
  videoFile = media.video
  image: any;
  profileImage: any;
  profileImageName: string;
  page: number;
  searchKey: any;
  public activePage: number = 1;
  public rowsOnPage: number = environment.LIMIT;
  sortKey: any = "_id";
  sortKeyValue: any = 'DESC';
  filterParams: any;
  filterStatus: any;
  requestType: number = 1;
  reject_reason: string = '';
  reasornError: boolean = false;
  completeRequest: any;
  allType: boolean = true;
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
  constructor(private spinner: NgxSpinnerService, private modalService: BsModalService,
    private toastr: ToastrService,  private router: Router, private commonService: CommonService,private translate: TranslateService,public ds: DataService
  ) {
    this.page = 1;
    this.searchKey = '';
    this.dataList = [];
    this.filterStatus = '';
    this.filterParams = '';
    this.postponeDays = '';
    this.completeRequest = {
      comment: '',
      rating: 1,
      video: '',
      image: ''
    };
  }

  ngOnInit() {
    this.getAll();
    console.log(this.videoFile)

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
  Name: getAll
  Description: Get list of all type of bookings requests
  */
  getAll() {
    this.spinner.show();
    let path = `booking/get-all`;
    let options = {};
    options = {
      type: '',
      page: this.activePage,
      count: this.rowsOnPage,
      search: this.searchKey,
      status: this.filterStatus,
      sort: "DESC"
    };

    this.commonService.queryParams(path, options).subscribe(response => {
      this.dataList = response.data.data;
      console.log('this.dataList',this.dataList)
      this.totalRecords = response.data.total;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: filterRecords
  Description: Filter the records based on status and fetch updated records
  */
  filterRecords() {
    this.filterStatus = this.filterStatus;
    this.getAll();
    
  }

  /*
  Name: updateStatus
  Description: Update status of request
  */
  updateStatus(item, status) {
    this.spinner.show();
    let path = `booking/updateStatus`;
    let json = {
      requestId: item._id,
      status: status,
      reason: this.reject_reason,
      postponeDay: this.postponeDays
    };
    this.commonService.put(path, json).subscribe(response => {
      if (status == 2) {
        this.toastr.success('Request accepted successfully');
      } else if (status == 3) {
        this.reject_reason = '';
        this.toastr.success('Request rejected successfully');
      } else if (status == 6) {
        this.postponeDays = '';
        this.toastr.success('Request postpone successfully');
      }
      this.getAll();
      this.closeModal2();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }


  // code to change the video privacy status

  publishMessage(id, status) {
    this.spinner.show();
    let path = `booking/update-dm-status`;
    let options = {
      booking_id: id,
      isPublic : Boolean = status,
      
    };
    this.commonService.put(path, options).subscribe(response => {
      if (status == true) {
        this.toastr.success('Successfully Un-Published');
      } else {
        
        this.toastr.success('Successfully Published');
      }
      this.getAll();
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  


  /*
  Name: changeStatus
  Description: Change status to activate or de-activate
  */
  changeStatus(item, event) {
    this.spinner.show();
    let path = `category/updateStatus`;
    let json = {
      id: item._id,
      status: event
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success('Category ' + (event ? 'Activated' : 'Deactivated') + ' successfully');
      this.getAll();
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
    this.activePage = event.page;
    this.getAll();
  }

  /*
  Name: reject
  Description: when rejects the request with reason
  */
  reject() {
    if (this.reject_reason == '') {
      this.reasornError = true;
      return false;
    } else {
      this.reject_reason = this.reject_reason;
      this.modalRef.hide();
      this.updateStatus(this.itemValue, 3)
    }
  }

  /*
  Name: closeModal
  Description: Close the Reject popup
  */
  closeModal() {
    this.modalRef.hide();
  }

  /*
  Name: openModal
  Description: Open popup click on Reject button
  */
  openModal(template: TemplateRef<any>, data, status) {
    this.modalRef = this.modalService.show(template);
    this.itemValue = data;
  }

  /*
  Name: openModal2
  Description: Open popup click on View button
  */
  openModal2(template: TemplateRef<any>, data) {
    this.modalRef1 = this.modalService.show(template);
    this.viewData = data;
    if (this.viewData.talentType == 'mp3') {
      this.msaapPlaylist = [
        {
          title: 'Audio Request',
          link: this.viewData.talentMp3
        }
      ]
    }
    if (this.viewData.status == 1) {
      let path = `booking/updateStatus`;
      let json = {
        requestId: this.viewData._id,
        status: 7
      };
      this.commonService.put(path, json).subscribe(response => {
        this.getAll();
      }, err => {
        this.commonService.handleError(err);
      });
    }
  }

  onEnded(event) {

  }

  /*
  Name: closeModal2
  Description: Close the View popup
  */
  closeModal2() {
    this.modalRef1.hide();
  } 

  /*
  Name: openModal3
  Description: Open popup click on Postpone button
  */
  openModal3(template: TemplateRef<any>, data) {
    this.modalRef2 = this.modalService.show(template);
    this.viewData = data;
  }

  /*
  Name: closeModal3
  Description: Close the Postpone popup
  */
  closeModal3() {
    this.modalRef2.hide();
  }

  /*
  Name: postponeSubmit
  Description: Submit from the postpone form
  */
  postponeSubmit() {
    if (this.postponeDays == '') {
      this.postponeError == true;
      return false;
    } else {
      this.postponeDays = this.postponeDays;
      this.modalRef2.hide();
      this.updateStatus(this.viewData, 6)
    }
  }

  /*
  Name: cancelRequest
  Description: Cancelled the request
  */
  cancelRequest(item) {
    this.spinner.show();
    let path = `booking/updateStatus`;
    let json = {
      requestId: item._id,
      status: 4
    };
    this.commonService.put(path, json).subscribe(response => {
      this.getAll();
      this.toastr.success('Cancelled successfully');
      this.spinner.hide();
      this.modalRef.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: onRate
  Description: Rate to the booking
  */
  onRate(event) {
    this.completeRequest.rating = event.newValue;
  }


  /*
  Name: onVideoUpload
  Description: Upload video
  */
  onVideoUpload(event) {
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size > this.videoFile) {
        this.toastr.error("Too large image, Please upload profile image of size 25mb or less.");
        return false;
      } else {
        const video = event.target.files[0];
        this.spinner.show();
        const formData: FormData = new FormData();
        formData.append('video', video);
        let apiPath = `common/videoUpload`;
        this.commonService.post(apiPath, formData).subscribe(result => {
          const location = result.data;
          this.completeRequest.video = location;
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.commonService.handleError(err);
        });

      }
    }
  }

  onUpload(event) {
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      this.profileImage = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(this.profileImage);
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          let apiPath = `common/s3imgUpload`;
          this.commonService.post(apiPath, { "image": imgBase64Path }).subscribe(result => {
            const location = result.data.location;
            this.completeRequest.image = location;
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            this.commonService.handleError(err);
          });
        }
      }
    }
  }

  /*
  Name: complete
  Description: Complete the booking
  */
  complete() {
    this.spinner.show();
    this.completeRequest.requestId = this.itemValue._id;
    let path = `booking/completeBooking`;
    this.commonService.put(path, this.completeRequest).subscribe(response => {
      this.toastr.success('Request Completed successfully');
      this.spinner.hide();
      this.modalRef.hide();
      this.getAll();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: sortBy
  Description: Sort the results based on key
  */
  sortBy(key) {
    this.sortKey = key;
    if (this.sortKeyValue === 'DESC') {
      this.sortKeyValue = 'ASC';
    } else {
      this.sortKeyValue = 'DESC';
    }
    this.getAll();
  }

  
  copyUrl(val: any){
    const selBox = document.createElement('textarea');
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


}
