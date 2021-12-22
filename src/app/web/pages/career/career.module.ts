import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CareerRoutingModule } from './career-routing.module';
import { CareerComponent } from '../career/career.component';


@NgModule({
  declarations: [CareerComponent],
  imports: [
    CommonModule,
    CareerRoutingModule
  ]
})
export class CareerModule { }
