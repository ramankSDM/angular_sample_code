import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { AppSharedModule } from '../../shared/app-shared.module';
import { FormComponent } from './form/form.component';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  declarations: [PagesComponent, FormComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    AppSharedModule,
    CKEditorModule
  ]
})
export class PagesModule { }
