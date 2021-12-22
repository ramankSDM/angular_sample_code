import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from '../../shared/app-shared.module';

import { TicketRoutingModule } from './ticket-routing.module';
import { TicketComponent } from './ticket.component';


@NgModule({
  declarations: [TicketComponent],
  imports: [
    CommonModule,
    TicketRoutingModule,
    AppSharedModule
  ]
})
export class TicketModule { }
