import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FansComponent } from './fans.component';

const routes: Routes = [
  {
    path: '',
    component: FansComponent,
    children: [
      { path: '', redirectTo: '', pathMatch: 'prefix' },   
      {
        path: "fans-profile",
        loadChildren: () =>
          import("./profile/profile.module").then((m) => m.ProfileModule),
        // canActivate: [SecureInnerPagesGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FansRoutingModule { }
