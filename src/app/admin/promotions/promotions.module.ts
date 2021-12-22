import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionsRoutingModule } from './promotions-routing.module';
import { PromotionsComponent } from './promotions.component';
import { AppSharedModule } from '../../shared/app-shared.module';
import { FormComponent } from './form/form.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {CalendarModule} from 'primeng/calendar';
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from 'primeng/dropdown';
@NgModule({
  declarations: [PromotionsComponent, FormComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    PromotionsRoutingModule,
    NgMultiSelectDropDownModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule
  ]
})
export class PromotionsModule { }
