import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OtpVerificationRoutingModule } from './otp-verification-routing.module';
import {OtpVerificationComponent} from './otp-verification.component';

@NgModule({
  declarations: [OtpVerificationComponent],
  imports: [
    CommonModule,
    OtpVerificationRoutingModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class OtpVerificationModule { }
