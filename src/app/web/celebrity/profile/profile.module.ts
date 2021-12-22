import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ProfileComponent } from './profile.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ProfileRoutingModule } from './profile-routing.module';
import { VideoRecordsComponent } from '../../components/video-records/video-records.component';
import { MaterialFileUploadComponent } from '../../components/material-file-upload/material-file-upload.component';
import { MatIconModule } from '@angular/material/icon';
import { AppSharedModule } from '../../../shared/app-shared.module';
import {CalendarModule} from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MomentTimezonePickerModule } from 'moment-timezone-picker';
import { ImageCropperModule } from 'ngx-image-cropper';
import {LanguageTranslationModule } from "./../../../shared/modules/language-translation/language-translation.module"

@NgModule({
  declarations: [ProfileComponent, VideoRecordsComponent, MaterialFileUploadComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    ProfileRoutingModule,
    AppSharedModule,
    MatIconModule,
    CalendarModule,DropdownModule,MomentTimezonePickerModule,
    ImageCropperModule,
    LanguageTranslationModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileModule { }
