import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CelebritiesRoutingModule } from './celebrities-routing.module';
import { CelebritiesComponent } from './celebrities.component';

import { AppSharedModule } from '../../shared/app-shared.module';
import { FormComponent } from './form/form.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
  declarations: [CelebritiesComponent, FormComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    NgMultiSelectDropDownModule,
    CelebritiesRoutingModule
  ]
})
export class CelebritiesModule { }
