import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AuthGuard,
  SecureInnerPagesGuard,
  VendorGuard,
  AdminGuard,
} from "./shared";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () => import('./web/web.module').then(m => m.WebModule)
  },
  {
    path: '',
    redirectTo: 'admin/login',
    pathMatch: 'full'
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
    // canActivate: [AdminGuard],
  },
  {
    path: "celebrities",
    loadChildren: () => import("./celebrities/celebrities.module").then((m) => m.CelebritiesModule),
    // canActivate: [VendorGuard],
  },
  {
    path: "login",
    loadChildren: () =>
      import("../app/auth/login/login.module").then((m) => m.LoginModule),
    // canActivate: [SecureInnerPagesGuard],
  },

  {
    path: "signup",
    loadChildren: () =>
      import("../app/auth/signup/signup.module").then((m) => m.SignupModule),
    // canActivate: [SecureInnerPagesGuard],
  },

  {
    path: "verifyEmail/:email/:token",
    loadChildren: () =>
      import("../app/auth/verify-email/verify-email.module").then(
        (m) => m.VerifyEmailModule
      ),
  },

  {
    path: "forgot-password",
    loadChildren: () =>
      import("../app/auth/forgot-password/forgot-password.module").then(
        (m) => m.ForgotPasswordModule
      ),
  //  canActivate: [SecureInnerPagesGuard],
  },

  {
    path: "reset-password/:id",
    loadChildren: () =>
      import("../app/auth/reset-password/reset-password.module").then(
        (m) => m.ResetPasswordModule
      ),
  //  canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "otp-verification",
    loadChildren: () =>
      import("../app/auth/otp-verification/otp-verification.module").then(
        (m) => m.OtpVerificationModule
      ),
  //  canActivate: [SecureInnerPagesGuard],
  },

  {
    path: "error",
    loadChildren: () =>
      import("./server-error/server-error.module").then(
        (m) => m.ServerErrorModule
      ),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
