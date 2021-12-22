import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CelebritiesComponent } from './celebrities.component';

const routes: Routes = [
  {
    path: '',
    component: CelebritiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CelebritiesRoutingModule { }
