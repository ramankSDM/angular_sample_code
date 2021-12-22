import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from '../../shared/app-shared.module';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {LanguageTranslationModule } from "./../../shared/modules/language-translation/language-translation.module";

@NgModule({
  declarations: [CategoryComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    CarouselModule,
    AppSharedModule,
    LanguageTranslationModule
  ]
})
export class CategoryModule { }
