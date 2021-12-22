import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareProfileRoutingModule } from './share-profile-routing.module';
import { ShareProfileComponent } from './share-profile.component';


//import { AppSharedModule } from '../../shared/app-shared.module';
//import { FormComponent } from './form/form.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {CalendarModule} from 'primeng/calendar';
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from 'primeng/dropdown';




@NgModule({
  declarations: [],
  imports: [
     CommonModule,
    NgMultiSelectDropDownModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule,
    ShareProfileRoutingModule
  ]
})
export class ShareProfileModule { }
