import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ProfileRoutingModule } from './profile-routing.module';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    GooglePlaceModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
