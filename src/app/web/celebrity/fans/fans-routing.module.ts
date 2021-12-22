import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FansComponent } from './fans.component';

const routes: Routes = [
  {
    path: '',
    component: FansComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FansRoutingModule { }
