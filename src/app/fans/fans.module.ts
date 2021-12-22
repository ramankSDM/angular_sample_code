import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FansRoutingModule } from './fans-routing.module';
import { FansComponent } from './fans.component';


@NgModule({
  declarations: [FansComponent],
  imports: [
    CommonModule,
    FansRoutingModule
  ]
})
export class FansModule { }
