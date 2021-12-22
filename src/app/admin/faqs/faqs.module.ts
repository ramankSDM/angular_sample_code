import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqsRoutingModule } from './faqs-routing.module';
import { FaqsComponent } from './faqs.component';
import { FormComponent } from './form/form.component';
import { AppSharedModule } from '../../shared/app-shared.module';

@NgModule({
  declarations: [FaqsComponent, FormComponent],
  imports: [
    CommonModule,
    FaqsRoutingModule,
    AppSharedModule
  ]
})
export class FaqsModule { }
