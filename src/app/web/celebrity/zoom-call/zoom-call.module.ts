import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZoomCallRoutingModule } from './zoom-call-routing.module';
import { ZoomCallComponent } from './zoom-call.component';
import { AppSharedModule } from '../../../shared/app-shared.module';

import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule} from '@angular/material/core'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  OwlDateTimeModule, 
  OwlNativeDateTimeModule 
} from 'ng-pick-datetime';
import { LanguageTranslationModule } from 'src/app/shared';

@NgModule({
  declarations: [ZoomCallComponent],
  imports: [
    CommonModule,
    ZoomCallRoutingModule,
    MatDatepickerModule,
    MatMenuModule,
    MatNativeDateModule,FormsModule, ReactiveFormsModule,OwlDateTimeModule,
    OwlNativeDateTimeModule,AppSharedModule, LanguageTranslationModule
  ]
})
export class ZoomCallModule { }
