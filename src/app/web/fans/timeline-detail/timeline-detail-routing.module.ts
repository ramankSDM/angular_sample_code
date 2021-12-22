import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimelineDetailComponent } from './timeline-detail.component';

const routes: Routes = [{
  path: '',
  component: TimelineDetailComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimelineDetailRoutingModule { }
