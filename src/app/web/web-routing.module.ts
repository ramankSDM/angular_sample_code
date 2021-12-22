import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CelebritiesComponent } from './celebrities/celebrities.component';
import { WebinarsComponent } from './webinars/webinars.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { WebComponent } from './web.component';
import { UserGuard } from '../shared/user.guard';
import { CalendarComponent } from './celebrity/calendar/calendar.component';
import { BankAccountComponent} from './celebrity/bank-account/bank-account.component'
const routes: Routes = [
  {
    path: '',
    component: WebComponent,
    children: [
      {
        path: 'celebrities/:slug',
        component: CelebritiesComponent
      },
      { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      {
        path: "celebrity/profile",
        canActivate: [UserGuard],
        loadChildren: () =>
          import("./celebrity/profile/profile.module").then((m) => m.ProfileModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "celebrity/bank-account",
        canActivate: [UserGuard],
        component: BankAccountComponent
      },
      {
        path: "celebrity/service",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./celebrity/service/service.module").then((m) => m.ServiceModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "celebrity/tag",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./celebrity/tag/tag.module").then((m) => m.TagModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "celebrity/my-booking",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./celebrity/my-booking/my-booking.module").then((m) => m.MyBookingModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "celebrity/gotTalent",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./celebrity/got-talent/got-talent.module").then((m) => m.GotTalentModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "celebrity/fans",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./celebrity/fans/fans.module").then((m) => m.FansModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "celebrity/contact",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./celebrity/contact/contact.module").then((m) => m.ContactModule),
        // canActivate: [SecureInnerPagesGuard],
      },
       {
        path: 'celebrity/calendar',
        component: CalendarComponent
      },
      {
        path: "fans/profile",
        loadChildren: () =>
          import("./fans/profile/profile.module").then((m) => m.ProfileModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "fans/promo-codes",
        loadChildren: () =>
          import("./fans/share-profile/share-profile.module").then((m) => m.ShareProfileModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "fans/my-booking",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./fans/my-bookings/my-bookings.module").then((m) => m.MyBookingsModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "fans/gotTalent",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./fans/got-talent/got-talent.module").then((m) => m.GotTalentModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "fans/fans-profile",
        loadChildren: () =>
          import("./fans/share-profile/share-profile.module").then((m) => m.ShareProfileModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "fans/celebrities",
        loadChildren: () =>
          import("./fans/celebrities/celebrities.module").then((m) => m.CelebritiesModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "fans/timeline",
        loadChildren: () =>
          import("./fans/timeline/timeline.module").then((m) => m.TimelineModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "fans/contact",
        loadChildren: () =>
          import("./fans/contact/contact.module").then((m) => m.ContactModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "category/:slug",
        loadChildren: () =>
          import("./category/category.module").then((m) => m.CategoryModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "search",
        loadChildren: () =>
          import("./search/search.module").then((m) => m.SearchModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: 'fans/change-password', component: ChangePasswordComponent
      },
      {
        path: 'celebrity/change-password', component: ChangePasswordComponent
      },
      {
        path: "categories/allCategories",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./categories/categories.module").then((m) => m.CategoriesModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "latest-videos",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./latest-videos/latest-videos.module").then((m) => m.LatestVideosModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "celebrity/manage-schedule",
        loadChildren: () =>
          import("./celebrity/zoom-call/zoom-call.module").then((m) => m.ZoomCallModule),
      },
      {
        path: "celebrity/schedule-meetings",
        loadChildren: () =>
          import("./celebrity/schedule/schedule.module").then((m) => m.ScheduleModule),
      },
      {
        path: "terms-condition",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./pages/terms-condition/terms-condition.module").then((m) => m.TermsConditionModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "privacy-policy",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./pages/privacy-policy/privacy-policy.module").then((m) => m.PrivacyPolicyModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "about-us",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./pages/about-us/about-us.module").then((m) => m.AboutUsModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "faq",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./pages/faq/faq.module").then((m) => m.FaqModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "career",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./pages/career/career.module").then((m) => m.CareerModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "news",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./pages/news/news.module").then((m) => m.NewsModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "support",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./pages/support/support.module").then((m) => m.SupportModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "contact",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./pages/contact/contact.module").then((m) => m.ContactModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "fans/schedule-meetings",
        loadChildren: () =>
          import("./fans/zoom-call-schedule/zoom-call-schedule.module").then((m) => m.ZoomCallScheduleModule),
      },
      {
      path: "celebrity/timeline",
        loadChildren: () =>
          import("./celebrity/timeline/timeline.module").then((m) => m.TimelineModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "celebrity/timeline-detail/:id",
          loadChildren: () =>
            import("./celebrity/timeline-detail/timeline-detail.module").then((m) => m.TimelineDetailModule),
          // canActivate: [SecureInnerPagesGuard],
        },
        {
          path: "celebrity/message",
            loadChildren: () =>
              import("./celebrity/message/message.module").then((m) => m.MessageModule),
            // canActivate: [SecureInnerPagesGuard],
          },
        {
          path: "fans/timeline-detail/:id",
            loadChildren: () =>
              import("./fans/timeline-detail/timeline-detail.module").then((m) => m.TimelineDetailModule),
            // canActivate: [SecureInnerPagesGuard],
          },
      {
      path: "celebrity/statistics",
        loadChildren: () =>
          import("./celebrity/statistics/statistics.module").then((m) => m.StatisticsModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "fans/wallet",
        loadChildren: () =>
          import("./fans/wallet/wallet.module").then((m) => m.WalletModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "celebrity/webinars",
        // canActivate: [UserGuard],
        loadChildren: () =>
          import("./celebrity/webinar-schedules/webinar-schedules.module").then((m) => m.WebinarSchedulesModule),
        // canActivate: [SecureInnerPagesGuard],
      },
      {
        path: 'celebrities/webinars/:slug',
        component: WebinarsComponent
      },
      {
        path: "webinars/all",        
        component: WebinarsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule]
})
export class WebRoutingModule { }
