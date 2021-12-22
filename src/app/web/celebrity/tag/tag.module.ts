import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagRoutingModule } from './tag-routing.module';
import { TagComponent } from './tag.component';
import { FormsModule } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';
import {MultiSelectModule} from 'primeng/multiselect';
import { AppSharedModule } from '../../../shared/app-shared.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { LanguageTranslationModule } from 'src/app/shared';

@NgModule({
  declarations: [TagComponent],
  imports: [
    CommonModule,
    TagRoutingModule,
    FormsModule,
    ChipsModule,
    AppSharedModule,
    MultiSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    LanguageTranslationModule
  ]
})
export class TagModule { }
