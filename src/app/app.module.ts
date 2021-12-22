import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { ToastModule } from "primeng/toast";
import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppSharedModule } from './shared/app-shared.module';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule,HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonService } from './services/common.service';
import { BasicAuthInterceptor } from "./shared/auth.interceptor";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from "primeng/api";
// import { YesNoPipe } from "./shared/pipes/yes-no.pipe"

import { AuthGuard } from "./shared";
import { ChatService } from "./shared/services/chat.service";

import { NgxSpinnerModule } from "ngx-spinner";
import { DataService } from "../app/services/data.service";
// Import the library
import { CarouselModule } from 'ngx-owl-carousel-o';

import { LanguageTranslationModule } from "./shared/modules/language-translation/language-translation.module";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SlickCarouselModule } from 'ngx-slick-carousel';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    RouterModule.forRoot(routes,{
      scrollPositionRestoration: 'enabled'
    }),
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppSharedModule,
    NgbModule,
    ToastModule,
    NgxSpinnerModule,
    CarouselModule,
    LanguageTranslationModule,
    SlickCarouselModule
  ],
  providers: [
    CommonService,
    AuthGuard,
    MessageService,
    CommonService,
    ChatService,
    DataService,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
