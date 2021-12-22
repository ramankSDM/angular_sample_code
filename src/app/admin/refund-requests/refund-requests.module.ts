import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RefundRequestsRoutingModule } from './refund-requests-routing.module';
import { RefundRequestsComponent } from './refund-requests.component';
import { AppSharedModule } from '../../shared/app-shared.module';
import { RatingModule } from 'ng-starrating';

@NgModule({
  declarations: [RefundRequestsComponent],
  imports: [
    CommonModule,
    RefundRequestsRoutingModule,
    AppSharedModule,RatingModule
  ]
})
export class RefundRequestsModule { }
