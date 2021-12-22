import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubAdminRoutingModule } from './sub-admin-routing.module';
import { SubAdminComponent } from './sub-admin.component';
import { FormComponent } from './form/form.component';
import { AppSharedModule } from '../../shared/app-shared.module';


@NgModule({
  declarations: [SubAdminComponent, FormComponent],
  imports: [
    CommonModule,
    SubAdminRoutingModule,
    AppSharedModule
  ]
})
export class SubAdminModule { }
