import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CelebritiesRoutingModule } from './celebrities-routing.module';
import { CelebritiesComponent } from './celebrities.component';
import { AppSharedModule } from '../../../shared/app-shared.module';
import {LanguageTranslationModule } from "./../../../shared/modules/language-translation/language-translation.module";

@NgModule({
  declarations: [CelebritiesComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    CelebritiesRoutingModule,LanguageTranslationModule
  ]
})

export class CelebritiesModule { }
