import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageTranslationModule } from 'src/app/shared';


@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    ContactRoutingModule,FormsModule, ReactiveFormsModule,LanguageTranslationModule
  ]
})
export class ContactModule { }
