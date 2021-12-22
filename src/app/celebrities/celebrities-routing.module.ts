import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CelebritiesComponent } from './celebrities.component';
import { AuthGuard } from '../shared/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CelebritiesComponent,
    canActivate: [AuthGuard],
    children: [
        { path: '', redirectTo: '', pathMatch: 'prefix' },
        {
         path: "./celebrity-profile",
         loadChildren: () =>
           import("./profile/profile.module").then((m) => m.ProfileModule),
         // canActivate: [SecureInnerPagesGuard],
       },
      // { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      // { path: 'sections', loadChildren: () => import('./sections/sections.module').then(m => m.SectionsModule) },
      // { path: 'services', loadChildren: () => import('./services/services.module').then(m => m.ServicesModule) },
      // { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
      // { path: 'bookings', loadChildren: () => import('./bookings/bookings.module').then(m => m.BookingsModule) },
      // { path: 'reviews', loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsModule) },
      //  { path: 'chat', loadChildren: () => import('../web/chat/chat.module').then(m => m.ChatModule) },
    ]

  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CelebritiesRoutingModule { }
