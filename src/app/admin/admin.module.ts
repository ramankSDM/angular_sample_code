import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AppSharedModule } from '../shared/app-shared.module';
import { AdminComponent } from './admin.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StyleguideComponent } from './styleguide/styleguide.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {ChartModule} from 'primeng/chart';
import { NotificationsComponent } from './notifications/notifications.component';




@NgModule({
  declarations: [
    AdminComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    StyleguideComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    ChangePasswordComponent,
    NotificationsComponent,
    
    
  ],
  imports: [
    AppSharedModule,
    AdminRoutingModule,ChartModule, 
  ]
})
export class AdminModule { }
