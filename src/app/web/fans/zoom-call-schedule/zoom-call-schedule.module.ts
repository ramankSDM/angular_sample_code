import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZoomCallScheduleRoutingModule } from './zoom-call-schedule-routing.module';
import { ZoomCallScheduleComponent } from './zoom-call-schedule.component';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule} from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core'; 
import { RatingModule } from 'ng-starrating';
import { MomentTimezonePickerModule } from 'moment-timezone-picker';
import { LanguageTranslationModule } from 'src/app/shared';

@NgModule({
  declarations: [ZoomCallScheduleComponent],
  imports: [
    CommonModule,
    ZoomCallScheduleRoutingModule,AppSharedModule,FormsModule, ReactiveFormsModule,MatDatepickerModule,MatMenuModule,MatNativeDateModule,RatingModule,MomentTimezonePickerModule, LanguageTranslationModule
  ]
})
export class ZoomCallScheduleModule { }
