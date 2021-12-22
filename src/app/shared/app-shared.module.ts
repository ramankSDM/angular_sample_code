
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CookieModule } from 'ngx-cookie';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { DataTableModule } from 'ng-angular8-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxMaskModule } from 'ngx-mask';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { UiSwitchModule } from 'ngx-ui-switch';
import {ToastModule} from 'primeng/toast';


@NgModule({
  declarations: [
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    CookieModule.forRoot(),
    ToastrModule.forRoot(),
    ToastModule,
    NgxSpinnerModule,
    DataTableModule,
    PaginationModule.forRoot(),
    NgxMaskModule.forRoot(),
    GooglePlaceModule,
    UiSwitchModule
  ],
  exports: [
    CommonModule,
    TooltipModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BsDropdownModule,
    AlertModule,
    CookieModule,
    ToastrModule,
    NgxSpinnerModule,
    DataTableModule,
    PaginationModule,
    NgxMaskModule,
    GooglePlaceModule,
    UiSwitchModule
  ],
  providers: [],
  bootstrap: []
})
export class AppSharedModule { }
