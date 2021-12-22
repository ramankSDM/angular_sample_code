import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { ServiceComponent } from './service.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DirectivesModule } from '../../../directive/directives.module';

@NgModule({
  declarations: [ServiceComponent],
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule,
    ReactiveFormsModule,
    ServiceRoutingModule
  ]
})
export class ServiceModule { }
