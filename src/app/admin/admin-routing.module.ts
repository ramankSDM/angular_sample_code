import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../shared/auth.guard';
import { StyleguideComponent } from './styleguide/styleguide.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { NotificationsComponent } from './notifications/notifications.component'



const routes: Routes = [
  {
    path: '', component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard', component: DashboardComponent,
      },
      {
        path: 'styleguide', component: StyleguideComponent,
      },
      {
        path: 'profile', component: ProfileComponent
      },
      {
        path: 'change-password', component: ChangePasswordComponent
      },
      {
        path: 'notifications', component: NotificationsComponent
      },
      
      {
        path: "fans",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./fans/fans.module").then(
            (m) => m.FansModule
          ),
      },
      {
        path: "celebrities",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./celebrities/celebrities.module").then(
            (m) => m.CelebritiesModule
          ),
      }
      ,
      {
        path: "blocked-fans",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./block-fans/block-fans.module").then(
            (m) => m.BlockFansModule
          ),
      },
      {
        path: "categories",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./categories/categories.module").then(
            (m) => m.CategoriesModule
          ),
      }
      ,
      {
        path: "bookings",
         canActivate: [AuthGuard],
        loadChildren: () =>
          import("./bookings/bookings.module").then(
            (m) => m.BookingsModule
          ),
      },
      {
        path: "refund-requests",
         canActivate: [AuthGuard],
        loadChildren: () =>
          import("./refund-requests/refund-requests.module").then(
            (m) => m.RefundRequestsModule
          ),
      },
      {
        path: "tags",
         canActivate: [AuthGuard],
        loadChildren: () =>
          import("./tags/tags.module").then(
            (m) => m.TagsModule
          ),
      }
      ,
      {
        path: "promotions",
         canActivate: [AuthGuard],
        loadChildren: () =>
          import("./promotions/promotions.module").then(
            (m) => m.PromotionsModule
          ),
      },
      {
        path: "rating",
         canActivate: [AuthGuard],
        loadChildren: () =>
          import("./rating/rating.module").then(
            (m) => m.RatingModule
          ),
      },
     
      {
        path: "pages",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./pages/pages.module").then(
            (m) => m.PagesModule
          ),
      },
      {
        path: "faq",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./faqs/faqs.module").then(
            (m) => m.FaqsModule
          ),
      },
      {
        path: "support-ticket",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./ticket/ticket.module").then(
            (m) => m.TicketModule
          ),
      },
      {
        path: "sub-admin",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./sub-admin/sub-admin.module").then(
            (m) => m.SubAdminModule
          ),
      },
     

    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
