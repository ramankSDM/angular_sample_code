import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { AppSharedModule } from '../../shared/app-shared.module';
import { FormComponent } from './form/form.component';
import { ListCelebritiesComponent } from './list-celebrities/list-celebrities.component';


@NgModule({
  declarations: [CategoriesComponent, FormComponent, ListCelebritiesComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    CategoriesRoutingModule
  ]
})
export class CategoriesModule { }
