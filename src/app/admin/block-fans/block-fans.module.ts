import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockFansRoutingModule } from './block-fans-routing.module';
import { BlockFansComponent } from './block-fans.component';
import { AppSharedModule } from '../../shared/app-shared.module';




@NgModule({
  declarations: [BlockFansComponent],
  imports: [
    CommonModule,
    BlockFansRoutingModule,
    AppSharedModule, 
  ]
})
export class BlockFansModule { }
