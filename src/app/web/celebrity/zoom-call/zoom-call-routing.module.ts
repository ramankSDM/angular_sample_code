import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZoomCallComponent } from './zoom-call.component';

const routes: Routes = [
  {
    path: '',
    component: ZoomCallComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZoomCallRoutingModule { }
