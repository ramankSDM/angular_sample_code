import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebinarSchedulesRoutingModule } from './webinar-schedules-routing.module';
import { WebinarSchedulesComponent } from './webinar-schedules.component';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import {CalendarModule} from 'primeng/calendar';
import { 
  OwlDateTimeModule, 
  OwlNativeDateTimeModule 
} from 'ng-pick-datetime';

import { RatingModule } from 'ng-starrating';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import { MomentTimezonePickerModule } from 'moment-timezone-picker';
import { LanguageTranslationModule } from 'src/app/shared';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [WebinarSchedulesComponent, FormComponent],
  imports: [
    CommonModule,
    WebinarSchedulesRoutingModule,AppSharedModule,FormsModule, ReactiveFormsModule,CalendarModule,OwlDateTimeModule,
    OwlNativeDateTimeModule,FullCalendarModule,RatingModule,MomentTimezonePickerModule,LanguageTranslationModule
  ]
})
export class WebinarSchedulesModule { }
