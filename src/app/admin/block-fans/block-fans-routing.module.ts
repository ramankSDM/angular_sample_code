import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockFansComponent } from './block-fans.component';

const routes: Routes = [{
  path: '', component: BlockFansComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockFansRoutingModule { }
