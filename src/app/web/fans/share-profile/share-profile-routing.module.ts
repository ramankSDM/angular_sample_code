import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareProfileComponent } from './share-profile.component';


const routes: Routes = [
  {path: '', component: ShareProfileComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShareProfileRoutingModule { }
