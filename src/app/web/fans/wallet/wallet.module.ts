import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { RatingModule } from 'ng-starrating';
import { LanguageTranslationModule } from 'src/app/shared';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [WalletComponent],
  imports: [
    CommonModule,
    WalletRoutingModule,
    AppSharedModule,
    RatingModule,
    LanguageTranslationModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class WalletModule { }
