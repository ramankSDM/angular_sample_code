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
import {reg} from "../../../shared/_json_files/constant"
import { event } from 'jquery';



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
  admin: any;
  image: any;
  profileImage: any;
  profileValue: string | ArrayBuffer;
  profileImageName: string;
  video: any;
  introVideo: any;
  language: any;
  videoType: any;
  vacation: any;
  userId: any;
  countryCodeList = countrycodes
  isSubmited: boolean = false;
  // select Category
  selectedOrderIds = [];
  itemTypeChk: boolean = false;
  itemTypeChklength: boolean = false;
  itemTypeList = [];

  selectchk = [];
  role: any;
  initialEmail: string;
  aryIannaTimeZones: any;
  strTime: any;
  minDate: Date;
  maxDate: Date;
  selectedZone: any;
  profileMsg: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  dedicateError: boolean = false;
  igotError: boolean = false;
  webinarError: boolean = false;
  zoomError: boolean = false;
  dmtextError: boolean = false;
  selectRange="1950:2005"
  videoFile = media.video
  imageFile = media.image

  constructor(private commonService: CommonService, private router: Router, public ds: DataService,
    private _cookieservice: CookieService,private translate: TranslateService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private fb: FormBuilder, ) {
    this.admin = {};
    this.vacation = 'false';
    this.userId = '';
    this.strTime = '';
    this.selectedZone = { name: "Asia/Dubai (+00:00)", nameValue: "Asia/Dubai", timeValue: "+00:00", group: "Asia", abbr: "GMT" };
    this.minDate = new Date();
    var pastYear = this.minDate.getFullYear() - 100;
    this.minDate.setFullYear(pastYear);
    this.maxDate = new Date();
    var pastMaxYear = this.maxDate.getFullYear() - 18;
    this.maxDate.setFullYear(pastMaxYear);
    this.selectRange="1950:"+pastMaxYear.toString()
  }

  ngOnInit(): void {
    console.log(this.videoFile + this.imageFile)
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

    this.getItemTypes();
    this.getById();
    this.frm = this.fb.group({   // Signup form
      fname_en: ['', [Validators.required]],
      fname_ar: ['', ],
      lname_en: ['', [Validators.required]],
      lname_ar: ['', ],
      displayName_en: ['', [Validators.required]],
      displayName_ar: ['', [Validators.required]],
      lang: ['', [Validators.required]],
      item_type_ids: this.fb.array([...this.selectchk]),
      category: [[], []],
      address_en: ['', []],
      address_ar: ['', []],
      role: ['3', []],
      city: ['', []],
      country:['',[]],
      state: ['', []],
      zipcode: ['', [Validators.required]],
      short_description_en: ['', []],
      short_description_ar: ['', []],
      description_en: ['', []],
      description_ar: ['', []],
      dedicated: [false, []],
      dedicated_price: [0, []],
      i_got_talent: [false, []],
      i_got_talent_price: [0, []],
      webinar: [false, []],
      webinar_price: [0, []],
      connect_on_zoom: [false, []],
      connect_on_zoom_price: [0, []],
      dm_text: [false, []],
      dm_text_price: [0, []],
      dm_video_price: [0, []],
      timezone: [''],
      timezoneobject: [''],
      vacation: ['', []],
      vaccStartDate: ['', []],
      vaccEndDate: ['', []],
      chatPreference:['',[Validators.required]]
    });

    this.frm2 = this.fb.group({   // Signup form     
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.maxLength(10), Validators.pattern("[0-9 ]{10}")]],
      std_code: [this.countryCodeList[0].isdcode, [Validators.required]],
      gender_en: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      secondary_email: ['', []],
      isEmailChange: [false, []],
    });

    this.frm3 = this.fb.group({   // Signup form     
      fb_link: ['', [Validators.required, Validators.pattern(reg)]],
      tw_link: ['', [Validators.pattern(reg)]],
      insta_link: ['', [Validators.pattern(reg)]],
      youtube_link: ['', [Validators.pattern(reg)]],
      linkin_link: ['', [Validators.pattern(reg)]],
      tiktok_link: ['', [Validators.pattern(reg)]],
      snap_link: ['', [Validators.pattern(reg)]],
      web_link: ['', [Validators.pattern(reg)]]
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
      this.commonService.post(apiPath, obj).subscribe(res => {
        if (res.status == 200) {
          this.spinner.hide();
          this.getById();
          this.ds.setProfile.emit(res.data)
          this.toastr.success( "Profile Image have been updated successfully!");
  
        } else {
          this.toastr.error(res.message);
        }
      },
        (err) => {
          this.commonService.handleError(err);
        }
      );
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
        this.toastr.error("Too large image, Please upload profile image of size 50mb or less.");
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
          // this.profileImageName = environment.backendURL + 'images/users/watermark/' + result.data;
          // this.profileImageName = environment.backendURL + 'images/users/' + result.data;
          this.profileImageName = result.data;
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
    
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      this.videoUploadCommon(event.target.files[0])
    }
  }

  setVideo(event: any) {
    if (event && event.name ) {
      this.videoUploadCommon(event);
    }
  
  }

  videoUploadCommon(event){
    console.log("event",event);
    this.introVideo = "";
    if (event.size > this.videoFile) {
      this.toastr.error("Too large image, Please upload profile image of size 50mb or less.");
      return false;
    } else {
      const video = event;
      this.spinner.show();
      const formData: FormData = new FormData();
      formData.append('video', video);
      let apiPath = `common/videoUpload`;
      console.log("formData", formData)
      this.commonService.post(apiPath, formData).subscribe(result => {
        // const location = environment.backendURL + 'uploads/' + result.data;
        console.log("result+++++", result);
        const location = result.data;
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

  /*
  Name: getById
  Description: Get the user full info
  */
  async getById() {
    this.selectedOrderIds=[]
    this.spinner.show();
    let apiPath = `user/get-profile`;
    return new Promise((resolve, reject) => {
      this.commonService.get(apiPath).subscribe(async res => {
        this.profileMsg = res.data.isReviewed;
        if (res.data.category && res.data.category.length) {
          res.data.category.forEach(data => {
            this.selectedOrderIds.push(data);
          });
        }
        this.itemTypeList.forEach(data => {
          data['flag'] = false;
          if (this.selectedOrderIds.includes(data._id)) {
            data['flag'] = true;
          }
        });
        this.initialEmail = res.data.email;
        res.data.dob = new Date(res.data.dob)
        res.data.vacation = res.data.onVacation
        if (res.data.vacation == true) {
          res.data.vaccStartDate = new Date(res.data.vaccStartDate)
          res.data.vaccEndDate = new Date(res.data.vaccEndDate)
        } else {
          res.data.vaccStartDate = ''
          res.data.vaccEndDate = ''
        }
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
        this.frm.patchValue({ ...res.data });
        this.frm2.patchValue({ ...personalObj });
        this.frm3.patchValue({ ...socialObj });
        this.image = res.data.image
        this.introVideo = res.data.intro_video
        this.ds.setProfile.emit(res.data)
        this.spinner.hide();
        this.vacation = res.data.onVacation;
        this.userId = res.data._id;
        if (res.data.timezone) {
          var timeZoneArr = res.data.timezone.split('/');
          this.selectedZone = { name: res.data.timezone + " (+00:00)", nameValue: res.data.timezone, timeValue: "+00:00", group: timeZoneArr[0], abbr: "GMT" };
        }
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
      if (this.selectedOrderIds.length <= 0) {
        this.itemTypeChk = true
        return;
      }
      if (this.selectedOrderIds.length > 3) {
        this.itemTypeChklength = true
        return;
      }
      return;
    }
    if (this.selectedOrderIds.length <= 0) {
      this.isSubmited = true;
      this.itemTypeChk = true
      return;
    }
    if (this.selectedOrderIds.length > 3) {
      this.isSubmited = true;
      this.itemTypeChklength = true
      return;
    }
    this.frm.value.category = this.selectedOrderIds
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

    if(this.frm.value['dedicated'] == false && this.frm.value['i_got_talent'] == false && this.frm.value['webinar'] == false && this.frm.value['connect_on_zoom'] == false && this.frm.value['dm_text'] == false){
      this.toastr.error("Select atleast one service")
    this.spinner.hide();
    }
    else
    {
  if (this.frm.value['dedicated'] == false) {
    this.frm.value['dedicated_price'] = 0
  }
  if (this.frm.value['i_got_talent'] == false) {
    this.frm.value['i_got_talent_price'] = 0
  }
  if (this.frm.value['webinar'] == false) {
    this.frm.value['webinar_price'] = 0
  }
  if (this.frm.value['connect_on_zoom'] == false) {
    this.frm.value['connect_on_zoom_price'] = 0
  }
  if (this.frm.value['dm_text'] == false) {
    this.frm.value['dm_text_price'] = 0
  }
  if (this.frm.value['dedicated'] == true && this.frm.value['dedicated_price'] == 0) {
    this.spinner.hide();
    this.igotError = false;
    this.webinarError = false;
    this.zoomError = false;
    this.dmtextError = false;
    this.dedicateError = true;
    return false;
  }

  if (this.frm.value['i_got_talent'] == true && this.frm.value['i_got_talent_price'] == 0) {
    this.spinner.hide();
    this.dedicateError = false;
    this.webinarError = false;
    this.zoomError = false;
    this.dmtextError = false;
    this.igotError = true;
    return false;
  }

  if (this.frm.value['webinar'] == true && this.frm.value['webinar_price'] == 0) {
    this.spinner.hide();
    this.igotError = false;
    this.dedicateError = false;
    this.zoomError = false;
    this.dmtextError = false;
    this.webinarError = true;
    return false;
  }

  if (this.frm.value['connect_on_zoom'] == true && this.frm.value['connect_on_zoom_price'] == 0) {
    this.spinner.hide();
    this.igotError = false;
    this.dedicateError = false;
    this.webinarError = false;
    this.dmtextError = false;
    this.zoomError = true;
    return false;
  }

  if (this.frm.value['dm_text'] == true && this.frm.value['dm_text_price'] == 0) {
    this.spinner.hide();
    this.igotError = false;
    this.dedicateError = false;
    this.webinarError = false;
    this.zoomError = false;
    this.dmtextError = true;
    return false;
  }


  this.frm.value['onVacation'] = this.frm.value['vacation'];
  if (this.frm.value['vacation'] == false) {
    this.frm.value['vaccStartDate'] = ''
    this.frm.value['vaccEndDate'] = ''
  } else {
    var starObj = new Date(this.frm.value['vaccStartDate']);
    this.frm.value['vaccStartDate'] = starObj.toISOString();

    var endObj = new Date(this.frm.value['vaccEndDate']);
    this.frm.value['vaccEndDate'] = endObj.toISOString();
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
      // this.toastr.success(res.message);
      this.toastr.success("Profile details have been updated successfully!");

    } else {
      this.toastr.error(res.message);
    }

  },
    (err) => {
      this.commonService.handleError(err);
    }
  );
  }
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
        // this.toastr.success(res.message, "Profile has been updated");
        this.toastr.success( "Personal details have been updated successfully!");

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
    let apiPath = `user/updateProfile`;    
    if(this.frm3.value.fb_link == '' && this.frm3.value.insta_link == '' && this.frm3.value.linkin_link == '' && this.frm3.value.snap_link == '' && this.frm3.value.tiktok_link == '' && this.frm3.value.tw_link == '' && this.frm3.value.web_link == '' && this.frm3.value.youtube_link == ''){
        this.toastr.error("fill atleast any one")
    }else{
      this.updateSocialFrm(apiPath, this.frm3.value)
    }    
  }

  /*
  Name: updateSocialFrm
  Description: Save the info into DB
  */
  updateSocialFrm(apiPath, data) {
    this.commonService.post(apiPath, data).subscribe(res => {
      if (res.status == 200) {
        this.getById();
        this.ds.setProfile.emit(res.data)
        // this.toastr.success(res.message);
        this.toastr.success("Social info have been updated successfully!");

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
  Name: activeTab
  Description: To show active tab from tabs
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
  Name: getItemTypes
  Description: GEt list of all categories
  */
  getItemTypes() {
    this.spinner.show();
    let path = `category/get-all-category`;
    let options = {
      page: 1,
      count: 100000,
      search: "",
      sortBy: "",
      sort: "",
      status: true
    };
    this.commonService.queryParams(path, options).subscribe(response => {
      this.itemTypeList = response.data.data;
      this.itemTypeList.forEach(data => {
        data['flag'] = false;
        if (this.selectedOrderIds.includes(data._id)) {
          data['flag'] = true;
        }
      });
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /*
  Name: selectItemType
  Description: Select any category
  */
  selectItemType(id, status) {
    const index = this.selectedOrderIds.indexOf(id);
    if (!status && index > -1) {
      this.selectedOrderIds.splice(index, 1);
    } else if (status && index == -1) {
      this.selectedOrderIds.push(id);
    }
    if (this.selectedOrderIds.length > 3) {
      this.itemTypeChklength = true
    } else {
      this.itemTypeChklength = false
    }
    if (this.selectedOrderIds.length > 0) {
      this.itemTypeChk = false
      return;
    } else {
      this.itemTypeChk = true
      return;
    }

  }
  


  // need to be comment after the test
 
  // videoUpload() {
  //   alert(2)
  //   var formData = new FormData();
  //   formData.append('files', this.video, this.video.name);
  //   this.commonService.post('file-upload', formData).subscribe(
  //     (data: any) => {
  //       if (data.status === 200) {
  //         this.introVideo = data.data[0];
  //         this.toastr.success(data.message);
  //       }
  //     },
  //     (error) => {
  //       this.toastr.error(error.error);
  //     }
  //   );
  // }

  setVideoType(e) {
    this.videoType = e;
  }

  // onFileComplete(e) {
  //   alert(1)
  //   if (e.status==200) {
  //     let apiPath = `user/updateProfile`;
  //      this.introVideo = e.data[0];
  //     var obj={intro_video:this.introVideo}
  //     this.updateFrm(apiPath,obj) 
  //   }
  // }

  /*
  Name: changeStatus
  Description: Change status to activate or de-activate
  */
  changeStatus(userId, event) {
    this.spinner.show();
    let path = `celebrity/updateVacationStatus`;
    let json = {
      id: userId,
      onVacation: event
    };
    this.commonService.put(path, json).subscribe(response => {
      this.toastr.success((event ? 'Activated' : 'Deactivated') + ' successfully');
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
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
