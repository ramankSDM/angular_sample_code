import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {LanguageTranslationModule } from "./../../shared/modules/language-translation/language-translation.module"
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CarouselModule,
    LanguageTranslationModule,SlickCarouselModule
  ]
})
export class HomeModule { }
