import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RefundRequestsComponent } from './refund-requests.component'; 

const routes: Routes = [
  {
    path: '', 
    component: RefundRequestsComponent
  }]
  ;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundRequestsRoutingModule { }
