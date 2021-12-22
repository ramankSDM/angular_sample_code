import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageRoutingModule } from './message-routing.module';
import { MessageComponent } from './message.component';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { LanguageTranslationModule } from 'src/app/shared';


@NgModule({
  declarations: [MessageComponent],
  imports: [
    CommonModule,
    MessageRoutingModule,
    AppSharedModule, LanguageTranslationModule
  ]
})
export class MessageModule { }
