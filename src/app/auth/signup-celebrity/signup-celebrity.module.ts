import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupCelebrityRoutingModule } from './signup-celebrity-routing.module';
import { SignupCelebrityComponent } from './signup-celebrity.component';
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { TranslateModule } from "@ngx-translate/core";
import { AppSharedModule } from '../../shared/app-shared.module';

import { environment } from "../../../environments/environment";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
// import { InputMaskModule } from "primeng/inputmask";
import {AuthModule} from '../../auth.module'
import {CalendarModule} from 'primeng/calendar';
import {LanguageTranslationModule } from "./../../shared/modules/language-translation/language-translation.module"

@NgModule({
  declarations: [SignupCelebrityComponent],
  imports: [
    LanguageTranslationModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule,
    SocialLoginModule,
    // InputMaskModule,
    AuthModule,
    AppSharedModule,
    CalendarModule,
    SignupCelebrityRoutingModule,
    NgbModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.google_app_id
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebook_app_id),
          }
        ],
      } as SocialAuthServiceConfig,
    },
    NgbActiveModal
  ]
})
export class SignupCelebrityModule { }
