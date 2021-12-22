import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ProfileRoutingModule } from './profile-routing.module';
import { VideoRecordsComponent } from '../../components/video-records/video-records.component';


@NgModule({
  declarations: [ProfileComponent,VideoRecordsComponent],
  imports: [
    CommonModule,
    FormsModule,
    GooglePlaceModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
