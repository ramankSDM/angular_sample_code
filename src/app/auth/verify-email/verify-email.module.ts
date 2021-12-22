import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { VerifyEmailRoutingModule } from './verify-email-routing.module';
import {VerifyEmailComponent}  from './verify-email.component'

@NgModule({
  imports: [
    CommonModule,
    VerifyEmailRoutingModule,
    TranslateModule
  ],
  declarations: [VerifyEmailComponent]
})
export class VerifyEmailModule { }
