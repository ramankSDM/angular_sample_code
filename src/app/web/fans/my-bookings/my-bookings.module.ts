import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyBookingsRoutingModule } from './my-bookings-routing.module';
import { MyBookingsComponent } from './my-bookings.component';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { RatingModule } from 'ng-starrating';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ShoutOutComponent } from './shout-out/shout-out.component';
import { IGotTalentComponent } from './i-got-talent/i-got-talent.component';
import { WebinarComponent } from './webinar/webinar.component';
import { ZoomCallComponent } from './zoom-call/zoom-call.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule} from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core'; 
import { MomentTimezonePickerModule } from 'moment-timezone-picker';
import { DmComponent } from './dm/dm.component';
import { LanguageTranslationModule } from 'src/app/shared';


@NgModule({
  declarations: [MyBookingsComponent, ShoutOutComponent, IGotTalentComponent, WebinarComponent, ZoomCallComponent, DmComponent],
  imports: [
    CommonModule,
    MyBookingsRoutingModule,
    AppSharedModule,
    RatingModule,
    NgxAudioPlayerModule,
    CarouselModule,
   FormsModule, ReactiveFormsModule,MatDatepickerModule,MatMenuModule,MatNativeDateModule,MomentTimezonePickerModule,LanguageTranslationModule
  ]
})
export class MyBookingsModule { }
