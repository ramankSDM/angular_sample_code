import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { countrycodes } from "../../../shared/_json_files/countryCode";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from "./../../../services/data.service";
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {media} from "../../../shared/_json_files/constant"

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  selectedLang: any = 'en';
  langs: any = [];
  frm: FormGroup;
  frm2: FormGroup;
  frm3: FormGroup;
  frm4: FormGroup;
  admin: any;
  image: any;
  profileImage: any;
  profileValue: string | ArrayBuffer;
  profileImageName: string;
  video: any;
  introVideo: any;
  language: any;
  videoType: any;
  countryCodeList = countrycodes
  isSubmited: boolean = false;
  // select Category
  selectedOrderIds = [];
  selectchk = [];
  role: any;
  initialEmail: ""
  aryIannaTimeZones: any;
  strTime: any;
  minDate: Date;
  maxDate: Date;
  celebrityData: any = [];
  sortKey: any = "_id";
  sortKeyValue: any = 'DESC';
  selectedZone: any;
  selectRange="1950:2005"
  imageChangedEvent: any = '';
  croppedImage: any = '';
  videoFile = media.video
  imageFile = media.image
  referralCode
  isSignSubmited: boolean = false;


  constructor(private commonService: CommonService, private router: Router, public ds: DataService,
    private _cookieservice: CookieService,private translate: TranslateService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private fb: FormBuilder, ) {
    this.admin = {};
    this.strTime = '';

    // this.language = "english";
    //this.admin.std_code = this.countryCodeList[0].isdcode;
    this.minDate = new Date();
    var pastYear = this.minDate.getFullYear() - 100;
    this.minDate.setFullYear(pastYear);
    this.maxDate = new Date();
    var pastMaxYear = this.maxDate.getFullYear() - 18;
    this.maxDate.setFullYear(pastMaxYear);
    this.selectRange="1950:"+pastMaxYear.toString()
    this.selectedZone = { name: "Asia/Dubai (+00:00)", nameValue: "Asia/Dubai", timeValue: "+00:00", group: "Asia", abbr: "GMT" };
  }
  //this._cookieservice.get('user-starsin')
  ngOnInit(): void {
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

    this.getById();
    this.getCelebrity();
    this.frm = this.fb.group({   // Signup form
      fname_en: ['', [Validators.required]],
      fname_ar: ['',[] ],
      lname_en: ['', [Validators.required]],
      lname_ar: ['', []],
      address_en: ['', []],
      address_ar: ['', []],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', []],
      zipcode: ['', [Validators.required]],
      fav_star: ['', []],
      // profession_en: ['', []],
      // profession_ar: ['', []],
      description_en: ['', []],
      description_ar: ['', []],
      timezoneobject: [''],
      lang: ['', [Validators.required]],
    });

    this.frm2 = this.fb.group({   // Signup form     
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      std_code: [this.countryCodeList[0].isdcode, [Validators.required]],
      gender_en: ['', [Validators.required]],
      dob: [this.maxDate, [Validators.required]],
      secondary_email: ['', []],
      isEmailChange: [false, []],
    });

    const urlReg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

    this.frm3 = this.fb.group({   // Signup form     
      fb_link: ['', [Validators.pattern(urlReg)]],
      tw_link: ['', [Validators.pattern(urlReg)]],
      insta_link: ['', [Validators.pattern(urlReg)]],
      youtube_link: ['', [Validators.pattern(urlReg)]],
      linkin_link: ['', [Validators.pattern(urlReg)]],
      tiktok_link: ['', [Validators.pattern(urlReg)]],
      snap_link: ['', [Validators.pattern(urlReg)]],
      web_link: ['', [Validators.pattern(urlReg)]]
    });

    this.frm4 = this.fb.group({   // Signup form     
      firstName: ['', [Validators.required, Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
    });

  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  getChangedLanguage(event) {
    this.language = event.target.value;
  }

  /*
  Name: onUploadImage
  Description: Upload the profile image
  */
  onUploadImage() {
    this.spinner.show();
    let event = this.croppedImage;
    let apiPath = `common/s3imgUpload`;
    this.commonService.post(apiPath, { "image": event }).subscribe(result => {
      this.profileImageName = result.data.location;
      var obj = { image: this.profileImageName, isUpdateImageVideo: 1, type: 'img' }
      let apiPath1 = `user/updateProfile`;
      this.updateFrm(apiPath1, obj)
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
    return false;
  }

  /*
  Name: onUpload
  Description: Upload the profile image
  */
  onUpload(event) {
    const allowedImageMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/jpg"
    ];
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      if (allowedImageMimeTypes.indexOf(event.target.files[0].type) == -1) {
        this.toastr.error("Please upload an image with one of the following extensions : '.jpeg','.jpg','.gif','.png','.png','.bmp'");
        return false;
      } else if (event.target.files[0].size > this.imageFile) {
        this.toastr.error("Too large image, Please upload profile image of size 25mb or less.");
        return false;
      } else {
        this.profileImage = event.target.files[0];

        var mimeType = this.profileImage.type;
        if (mimeType.match(/image\/*/) == null) {
          this.toastr.error('Please upload image only');
          return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(this.profileImage);
        reader.onload = (_event) => {
          this.image = reader.result
        }
        this.spinner.show();
        const formData: FormData = new FormData();
        formData.append('images', this.profileImage);
        let apiPath = `common/imgUpload`;
        this.commonService.post(apiPath, formData).subscribe(result => {
          this.profileImageName = environment.backendURL + 'images/users/' + result.data;
          this.commonService.notifyOther({ option: 'update-image', value: this.profileImageName });
          var obj = { image: this.profileImageName, isUpdateImageVideo: 1, type: 'img' }
          let apiPath1 = `user/updateProfile`;
          this.updateFrm(apiPath1, obj)
          this.getById();
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.commonService.handleError(err);
        });

      }
    }
  }

  /*
  Name: onVideoUpload
  Description: Upload the profile video
  */
  onVideoUpload(event) {
    this.introVideo = "";
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
          const location = environment.backendURL + 'uploads/' + result.data;
          var obj = { intro_video: location, isUpdateImageVideo: 1, type: 'video' }
          let apiPath1 = `user/updateProfile`;
          this.updateFrm(apiPath1, obj)
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.commonService.handleError(err);
        });

      }
    }
  }

  /*
  Name: getById
  Description: Get the user full info
  */
  async getById() {
    this.spinner.show();
    let apiPath = `user/get-profile`;
    return new Promise((resolve, reject) => {
      this.commonService.get(apiPath).subscribe(async res => {
        this.initialEmail = res.data.email;
        res.data.dob = new Date(res.data.dob)
        this.referralCode = res.data.referralCode
        this.frm.patchValue({ ...res.data });

        let socialObj = {
          insta_link: res.data.insta_link,
          fb_link: res.data.fb_link,
          youtube_link: res.data.youtube_link,
          tw_link: res.data.tw_link,
          tiktok_link: res.data.tiktok_link,
          snap_link: res.data.snap_link,
          linkin_link: res.data.linkin_link,
          web_link: res.data.web_link
        }

        let personalObj = {
          email: res.data.email,
          std_code: res.data.std_code,
          phone: res.data.phone,
          dob: res.data.dob,
          gender_en: res.data.gender_en
        }
        this.frm2.patchValue({ ...personalObj });
        this.frm3.patchValue({ ...socialObj });

        this.image = res.data.image
        this.ds.setProfile.emit(res.data)
        if (res.data.timezone) {
          var timeZoneArr = res.data.timezone.split('/');
          this.selectedZone = { name: res.data.timezone + " (+00:00)", nameValue: res.data.timezone, timeValue: "+00:00", group: timeZoneArr[0], abbr: "GMT" };
        }
        this.spinner.hide();
      },
        (err) => {
          this.commonService.loading(false)
          this.commonService.handleError(err);
        }
      );
    });
  }

  /*
  Name: handleAddressChange
  Description: Change the address
  */
  handleAddressChange(place: Address) {
    this.spinner.show();
    const location_obj = {};
    location_obj['lat'] = (place.geometry && place.geometry.location && place.geometry.location.lat()) ? place.geometry.location.lat() : '';
    location_obj['lng'] = (place.geometry && place.geometry.location && place.geometry.location.lng()) ? place.geometry.location.lng() : '';
    for (const i in place.address_components) {
      const item = place.address_components[i];
      location_obj['formatted_address'] = place.formatted_address;
      location_obj['full_address'] = place.name + ', ' + place.formatted_address;
      if ((item.types.indexOf('locality') > -1) || (item.types.indexOf('sublocality_level_1') > -1) || (item.types.indexOf('administrative_area_level_2') > -1)) {
        location_obj['city'] = item.long_name;
      } else if (item.types.indexOf('administrative_area_level_1') > -1) {
        location_obj['state'] = item.long_name;
      } else if (item.types.indexOf('street_number') > -1) {
        location_obj['street_number'] = item.short_name;
      } else if (item.types.indexOf('route') > -1) {
        location_obj['route'] = item.long_name;
      } else if (item.types.indexOf('country') > -1) {
        location_obj['country'] = item.long_name;
      } else if (item.types.indexOf('postal_code') > -1) {
        location_obj['postal_code'] = item.short_name;
      }

    }
    this.frm.patchValue({
      city: location_obj['city'],
      state: location_obj['state'],
      zipcode: location_obj['postal_code'],
      address_en: location_obj['formatted_address'],
      country: location_obj['country']
    })
    this.spinner.hide();
  }

  /*
  Name: update
  Description: Update the Profile
  */
  update() {
    let apiPath = `user/updateProfile`;
    if (this.frm.invalid) {

      this.isSubmited = true;
      return;
    }
    if (this.profileImageName) {
      this.frm.value.category['image'] = this.profileImageName;
    }

    this.frm.value.timezone = this.frm.value.timezoneobject.nameValue;
    delete this.frm.value.timezoneobject;
    this.updateFrm(apiPath, this.frm.value)
  }

  /*
  Name: updateFrm
  Description: Save the info into DB
  */
  updateFrm(apiPath, data) {
    this.spinner.show();
    if (this.frm.value['fav_star'] == '') {
      this.frm.value['fav_star'] = null;
    }

    this.commonService.post(apiPath, data).subscribe(res => {
      if (res.status == 200) {
        if (this.profileImageName && this.profileImageName != '') {
          let a = JSON.parse(this._cookieservice.get("user-starsin"));
          a.image = this.profileImageName;
          this._cookieservice.put('user-starsin', JSON.stringify(a));
        }
        this.croppedImage = '';
        this.imageChangedEvent = '';
        this.introVideo = res.data.intro_video
        this.getById();
        this.spinner.hide();
        this.ds.setProfile.emit(res.data)
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    },
      (err) => {
        this.commonService.handleError(err);
      }
    );
  }

  /*
  Name: update2
  Description: update personal tab
  */
  update2() {
    if (this.frm2.invalid) {
      this.isSubmited = true;
      return;
    }
    if (this.initialEmail !== this.frm2.value.email) {
      this.frm2.value.secondary_email = this.frm2.value.email;
      this.frm2.value.email = this.initialEmail;
      this.frm2.value.isEmailChange = true;
    }
    let apiPath = `user/updateProfile`;
    this.updatePersonalFrm(apiPath, this.frm2.value)
  }

  /*
  Name: updatePersonalFrm
  Description: Save the info into DB
  */
  updatePersonalFrm(apiPath, data) {
    var dateobj = new Date(this.frm2.value['dob']);
    this.frm2.value['dob'] = dateobj.toISOString();
    this.commonService.post(apiPath, data).subscribe(res => {
      if (res.status == 200) {
        this.getById();
        this.ds.setProfile.emit(res.data)
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    },
      (err) => {
        this.commonService.handleError(err);
      }
    );
  }

  /*
  Name: update3
  Description: update social tab
  */
  update3() {
    if (this.frm3.invalid) {

      this.isSubmited = true;
      return;
    }
    let apiPath = `user/updateProfile`;
    if(this.frm3.value.fb_link == '' && this.frm3.value.insta_link == '' && this.frm3.value.linkin_link == '' && this.frm3.value.snap_link == '' && this.frm3.value.tiktok_link == '' && this.frm3.value.tw_link == '' && this.frm3.value.web_link == '' && this.frm3.value.youtube_link == ''){
      this.toastr.error("fill atleast any one")
    }else{
      this.updateSocialFrm(apiPath, this.frm3.value)
    } 
  }

   /*
  Name: update4
  Description: update social tab
  */
  update4() {
    if (this.frm4.invalid) {
      this.isSignSubmited = true;
      return;
    }
    this.spinner.show();
    let apiPath = `referral/addReferral`;
    let data = this.frm4.value
    this.commonService.post(apiPath, data).subscribe(res => {
      if (res.status == 200) {
        this.getById();
        this.frm4.reset();
        this.ds.setProfile.emit(res.data)
        this.spinner.hide();
        this.toastr.success(res.message);
      } else {
        this.spinner.hide();
        this.toastr.error(res.message);
      }
    },
      (err) => {
        this.spinner.hide();
        this.commonService.handleError(err);
      }
    );
    
  }

  get f4 () { return this.frm4.controls; }

  /*
  Name: updateSocialFrm
  Description: Save the info into DB
  */
  updateSocialFrm(apiPath, data) {
    this.commonService.post(apiPath, data).subscribe(res => {
      if (res.status == 200) {
        this.getById();
        this.ds.setProfile.emit(res.data)
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    },
      (err) => {
        this.commonService.handleError(err);
      }
    );
  }

  setVideo($event: any) {
    this.video = $event;

  }

  /*
  Name: getCelebrity
  Description: Get list of all fanclub celebrities
  */
  getCelebrity() {
    let CFUser = this._cookieservice.get('user-starsin');
    let NewCFUser = JSON.parse(CFUser);
    let userId = NewCFUser._id;
    let apiPath = `fanclub/get-all-celebrities`;
    let options = {
      id: userId,
      page: 1,
      count: 1000,
      search: '',
      sortBy: this.sortKey,
      sort: this.sortKeyValue,
    };
    return new Promise((resolve, reject) => {
      this.commonService.queryParams(apiPath, options).subscribe(async res => {
        this.celebrityData = res.data.data;
        // this.initialEmail = res.data.email;
        // res.data.dob = new Date(res.data.dob)
        // this.frm.patchValue({ ...res.data });
        // this.image = res.data.image
        // this.ds.setProfile.emit(res.data)
      },
        (err) => {
          this.commonService.loading(false)
          this.commonService.handleError(err);
        }
      );
    });
  }

  setVideoType(e) {
    this.videoType = e;
  }

  /*
  Name: activeTab
  Description: Show active tab function
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
  Name: getCurrentTime
  Description: Get current time when changed timezone
  */
  getCurrentTime(event: any) {
    let date = new Date;
    this.strTime = date.toLocaleString("en-US", {
      timeZone: `${event.target.value}`
    });
  }
}
