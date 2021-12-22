import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ForgotPasswordComponent} from './forgot-password.component';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {LanguageTranslationModule } from "./../../shared/modules/language-translation/language-translation.module"

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ForgotPasswordRoutingModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule,
    LanguageTranslationModule
  ]
})
export class ForgotPasswordModule { }
