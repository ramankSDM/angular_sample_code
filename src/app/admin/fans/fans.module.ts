import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FansRoutingModule } from './fans-routing.module';
import { FansComponent } from './fans.component';

import { AppSharedModule } from '../../shared/app-shared.module';
import { FormComponent } from './form/form.component';

@NgModule({
  declarations: [FansComponent, FormComponent],
  imports: [
    CommonModule,
    FansRoutingModule,
    AppSharedModule
  ]
})
export class FansModule { }
