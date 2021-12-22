import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyBookingsComponent } from './my-bookings.component';
import { IGotTalentComponent } from './i-got-talent/i-got-talent.component';
import { WebinarComponent } from './webinar/webinar.component';
import { ZoomCallComponent } from './zoom-call/zoom-call.component';
import { ShoutOutComponent } from './shout-out/shout-out.component';
import { DmComponent } from './dm/dm.component';

const routes: Routes = [
  {
    path: '',
    component: MyBookingsComponent
  },  
  {
    path: 'shoutout',
    component: ShoutOutComponent
  },
  {
    path: 'i-got-talent',
    component: IGotTalentComponent
  },
  {
    path: 'webinar',
    component: WebinarComponent
  },
  {
    path: 'zoom-call',
    component: ZoomCallComponent
  },
  {
    path: 'dm',
    component: DmComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyBookingsRoutingModule { }
