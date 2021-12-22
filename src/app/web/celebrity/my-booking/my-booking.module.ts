import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyBookingRoutingModule } from './my-booking-routing.module';
import { MyBookingComponent } from './my-booking.component';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { RatingModule } from 'ng-starrating';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { IGotTalentComponent } from './i-got-talent/i-got-talent.component';
import { WebinarComponent } from './webinar/webinar.component';
import { ShoutOutComponent } from './shout-out/shout-out.component';
import { ZoomCallComponent } from './zoom-call/zoom-call.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DmComponent } from './dm/dm.component';
import { LanguageTranslationModule } from 'src/app/shared';

@NgModule({
  declarations: [MyBookingComponent, IGotTalentComponent, WebinarComponent, ShoutOutComponent, ZoomCallComponent, DmComponent],
  imports: [
    CommonModule,
    MyBookingRoutingModule,
    AppSharedModule,
    RatingModule,
    NgxAudioPlayerModule,
    CarouselModule,FormsModule, ReactiveFormsModule,LanguageTranslationModule
  ]
})
export class MyBookingModule { }
