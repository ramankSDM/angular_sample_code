import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LatestVideosRoutingModule } from './latest-videos-routing.module';
import { LatestVideosComponent } from './latest-videos.component';
import { AppSharedModule } from '../../shared/app-shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {LanguageTranslationModule } from "./../../shared/modules/language-translation/language-translation.module";



@NgModule({
  declarations: [LatestVideosComponent],
  imports: [
    CommonModule,
    LatestVideosRoutingModule,
    CarouselModule,
    AppSharedModule,
    LanguageTranslationModule
  ]
})
export class LatestVideosModule { }
