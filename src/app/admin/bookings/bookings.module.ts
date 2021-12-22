import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingsComponent } from './bookings.component';
import { AppSharedModule } from '../../shared/app-shared.module';
import {MultiSelectModule} from 'primeng/multiselect';
import { RatingModule } from 'ng-starrating';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [BookingsComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    AppSharedModule,
    MultiSelectModule,
    RatingModule,
    NgxAudioPlayerModule,
    CarouselModule
  ]
})
export class BookingsModule { }
