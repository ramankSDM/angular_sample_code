import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import {media} from "../../shared/_json_files/constant"

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  admin: any;
  profileImage: any;
  profileValue: string | ArrayBuffer;
  profileImageName: string;
  imageFile = media.image


  constructor(private commonService: CommonService, private router: Router,
    private _cookieservice: CookieService, private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    this.admin = {};
  }

  ngOnInit(): void {
    this.getData();
    console.log(this.admin)
    console.log(this.profileValue)
    console.log(this.imageFile)
    console.log(this.getData())

  }
  
  onUpload(event, profileForm) {
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
          this.admin.image = reader.result;
        }
        this.spinner.show();
        const formData: FormData = new FormData();
        formData.append('images', this.profileImage);
        let apiPath = `common/imgUpload`;
        this.commonService.post(apiPath, formData).subscribe(result => {
          this.profileImageName = environment.backendURL + 'images/users/' + result.data;
          this.commonService.notifyOther({ option: 'update-image', value: this.profileImageName });
          this.update(profileForm);
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.commonService.handleError(err);
        });

      }
    }
  }

  getData() {
    this.spinner.show();
    let apiPath = `user/get-profile`;
    this.commonService.get(apiPath).subscribe(result => {
      this.admin = result.data;
      if (this.admin && !this.admin.image) {
        this.admin.image = environment.frontendURL + 'assets/img/dummyimg.png';
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

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
    this.admin['city'] = location_obj['city'];
    this.admin['state'] = location_obj['state'];
    this.admin['zip'] = location_obj['postal_code'];
    this.admin['address'] = location_obj['formatted_address'];
    this.spinner.hide();
  }

  update(profileForm: NgForm) {
    this.spinner.show();
    let apiPath = `user/updateProfile`;
    let json = {
      fname: this.admin.fname,
      lname: this.admin.lname,
      phone: this.admin.phone,
      address: this.admin.address,
      city: this.admin.city,
      state: this.admin.state,
      zipcode: this.admin.zipcode,
    }
    if (this.profileImage) {
      json['image'] = this.profileImageName;
    }
    this.commonService.post(apiPath, json).subscribe(result => {
      this.toastr.success('Profile Updated Successfully');
      let dataToSet = {
        _id: result.data._id,
        email: result.data.email,
        loginToken: result.data.loginToken[result.data.loginToken.length - 1].token,
        role: result.data.role,
        fname: result.data.fname,
        lname: result.data.lname,
        image: result.data.image
      }
      this._cookieservice.remove('starin-admin');
      this._cookieservice.put('starin-admin', JSON.stringify(dataToSet));
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

}
