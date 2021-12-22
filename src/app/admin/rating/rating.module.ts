import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RatingRoutingModule } from './rating-routing.module';
import { RatingComponent } from './rating.component';
import { DropdownModule } from 'primeng/dropdown';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  declarations: [RatingComponent],
  imports: [
    CommonModule,
    RatingRoutingModule,
    DropdownModule,
    AppSharedModule,
    NgMultiSelectDropDownModule,
    CalendarModule,
    MultiSelectModule,NgbModule
  ]
})
export class RatingModule { }
