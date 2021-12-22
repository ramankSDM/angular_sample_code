import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GotTalentRoutingModule } from './got-talent-routing.module';
import { GotTalentComponent } from './got-talent.component';
import { AppSharedModule } from '../../../shared/app-shared.module';

@NgModule({
  declarations: [GotTalentComponent],
  imports: [
    CommonModule,
    GotTalentRoutingModule,
    AppSharedModule
  ]
})
export class GotTalentModule { }
