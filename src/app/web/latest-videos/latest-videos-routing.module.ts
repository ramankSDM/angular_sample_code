import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LatestVideosComponent } from './latest-videos.component';

const routes: Routes = [
  {path: '',component: LatestVideosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LatestVideosRoutingModule { }
