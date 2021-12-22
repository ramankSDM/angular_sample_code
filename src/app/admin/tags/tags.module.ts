import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags.component';
import { AppSharedModule } from '../../shared/app-shared.module';
import { FormComponent } from './form/form.component';
import { ListCelebritiesComponent } from './list-celebrities/list-celebrities.component';


@NgModule({
  declarations: [TagsComponent, FormComponent, ListCelebritiesComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    TagsRoutingModule
  ]
})
export class TagsModule { }
