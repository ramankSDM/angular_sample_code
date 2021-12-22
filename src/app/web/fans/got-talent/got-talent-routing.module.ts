import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotTalentComponent } from './got-talent.component';

const routes: Routes = [
  {
    path: '',
    component: GotTalentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GotTalentRoutingModule { }
