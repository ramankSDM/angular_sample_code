import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { AppSharedModule } from '../../shared/app-shared.module';

import { SignupRoutingModule } from "./signup-routing.module";
import { SignupComponent } from "./signup.component";
import { environment } from "../../../environments/environment";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
// import { InputMaskModule } from "primeng/inputmask";
import {AuthModule} from '../../auth.module'
import {CalendarModule} from 'primeng/calendar';
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {LanguageTranslationModule } from "./../../shared/modules/language-translation/language-translation.module"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SignupRoutingModule,
    MatButtonModule,
    MatInputModule,
    SocialLoginModule,
    // InputMaskModule,
    AuthModule,
    AppSharedModule,
    CalendarModule,
    NgbModule,
    LanguageTranslationModule
  ],
  declarations: [SignupComponent],
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
export class SignupModule {}
