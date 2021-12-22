import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FansRoutingModule } from './fans-routing.module';
import { FansComponent } from './fans.component';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { LanguageTranslationModule } from 'src/app/shared';

@NgModule({
  declarations: [FansComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    FansRoutingModule,LanguageTranslationModule
  ]
})
export class FansModule { }
