import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimelineDetailRoutingModule } from './timeline-detail-routing.module';
import { TimelineDetailComponent } from './timeline-detail.component';

import { AppSharedModule } from '../../../shared/app-shared.module';
import { RatingModule } from 'ng-starrating';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { CarouselModule } from 'ngx-owl-carousel-o';
@NgModule({
  declarations: [TimelineDetailComponent],
  imports: [
    CommonModule,
    TimelineDetailRoutingModule,
    AppSharedModule,
    RatingModule,
    NgxAudioPlayerModule,
    CarouselModule
  ]
})
export class TimelineDetailModule { }
