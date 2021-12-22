import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from '../shared/app-shared.module';
import { WebRoutingModule } from './web-routing.module';
import { WebComponent } from './web.component';
import { HeaderComponent } from './_sub/header/header.component';
import { FooterComponent } from './_sub/footer/footer.component';
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginModule } from "./../auth/login/login.module";
import { SignupModule } from "./../auth/signup/signup.module";
import { SignupCelebrityModule } from "./../auth/signup-celebrity/signup-celebrity.module";
import { ForgotPasswordModule } from "./../auth/forgot-password/forgot-password.module";
import { LoginComponent } from "./../auth/login/login.component";
import { SignupComponent } from "./../auth/signup/signup.component";
import { SignupCelebrityComponent } from "./../auth/signup-celebrity/signup-celebrity.component";
import { ForgotPasswordComponent } from "./../auth/forgot-password/forgot-password.component";
// import { ChatComponent } from "./chat/chat.component";
// import { ChatModule } from "./chat/chat.module";
import { FormsModule ,
    ReactiveFormsModule} from "@angular/forms";
import { CelebritiesComponent } from './celebrities/celebrities.component';
import { ShoutoutComponent } from './_model/shoutout/shoutout.component';

import { IotComponent } from './_model/iot/iot.component';
// import { ContactUsComponent } from "./contact-us/contact-us.component";
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
// import {CalendarModule} from 'primeng/calendar';
// import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
 import { InputMaskModule } from "primeng/inputmask";
import {LanguageTranslationModule } from "./../shared/modules/language-translation/language-translation.module";
import { ShareProfileComponent } from './fans/share-profile/share-profile.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AllReviewsComponent } from './_model/all-reviews/all-reviews.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ZoomCallComponent } from './_model/zoom-call/zoom-call.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule} from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core'; 
import {CalendarModule} from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MomentTimezonePickerModule } from 'moment-timezone-picker';
import { RatingModule } from 'ng-starrating';
import { WebinarsComponent } from './webinars/webinars.component';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction';
import { DmComponent } from './_model/dm/dm.component';
import { ReviewComponent } from './_model/review/review.component';
import { CalendarComponent } from './celebrity/calendar/calendar.component'; // a plugin
import { YesNoPipe } from "../shared/pipes/yes-no.pipe";
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from "../../environments/environment";
import { BankAccountComponent } from './celebrity/bank-account/bank-account.component';
import { AddToWalletComponent } from './fans/wallet/add-to-wallet/add-to-wallet.component';
import { SelectRoleComponent } from './_sub/select-role/select-role.component';
FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [WebComponent, HeaderComponent, FooterComponent, CelebritiesComponent, ShoutoutComponent, IotComponent, AllReviewsComponent,ShareProfileComponent, ChangePasswordComponent, ZoomCallComponent, WebinarsComponent, DmComponent, ReviewComponent, CalendarComponent, YesNoPipe, BankAccountComponent, AddToWalletComponent, SelectRoleComponent],
  imports: [
    AppSharedModule,
    CommonModule,
    WebRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    WebRoutingModule,
    LoginModule,
    SignupModule,
    SignupCelebrityModule,
    NgbModule,
    ForgotPasswordModule,
    LanguageTranslationModule,
    AutoCompleteModule,
    InputMaskModule,MatDatepickerModule,MatMenuModule,MatNativeDateModule,CalendarModule,DropdownModule,MomentTimezonePickerModule,RatingModule,
    DialogModule,InputTextModule,CheckboxModule,ButtonModule,TabViewModule,FullCalendarModule,
    NgxStripeModule.forRoot(environment.STRIPE_PK_KEY),
  ],
  providers: [NgbActiveModal],
  entryComponents: [
    SelectRoleComponent,
    LoginComponent,
    SignupComponent,
    SignupCelebrityComponent,
    ForgotPasswordComponent,
    ShoutoutComponent,
    AddToWalletComponent,
    IotComponent,
    AllReviewsComponent,
    ZoomCallComponent,
    DmComponent,
    ReviewComponent
  ],
})
export class WebModule { }
