import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppSharedModule } from '../../../shared/app-shared.module';
import { ProfileComponent } from './profile.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ProfileRoutingModule } from './profile-routing.module';
import { MatIconModule } from '@angular/material/icon';
import {CalendarModule} from 'primeng/calendar';
import { MomentTimezonePickerModule } from 'moment-timezone-picker';
import { ImageCropperModule } from 'ngx-image-cropper';
import {LanguageTranslationModule } from "./../../../shared/modules/language-translation/language-translation.module"

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppSharedModule,
    GooglePlaceModule,
    ProfileRoutingModule,
    MatIconModule,
    CalendarModule,MomentTimezonePickerModule,
    ImageCropperModule,
    LanguageTranslationModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileModule { }
