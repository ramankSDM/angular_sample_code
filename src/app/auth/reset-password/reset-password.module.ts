import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ResetPasswordComponent} from './reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ResetPasswordRoutingModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class ResetPasswordModule { }
