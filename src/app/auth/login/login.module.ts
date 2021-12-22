import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { MatButtonModule} from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { environment } from '../../../environments/environment';
import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import {AuthModule} from '../../auth.module'
import {LanguageTranslationModule } from "./../../shared/modules/language-translation/language-translation.module"

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        LoginRoutingModule,
        MatButtonModule,
        MatInputModule,
        SocialLoginModule,
        AuthModule,
        LanguageTranslationModule
    ],
    declarations: [LoginComponent],
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
        }
      ]
})
export class LoginModule {}
