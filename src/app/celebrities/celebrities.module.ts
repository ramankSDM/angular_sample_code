import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { NgbDropdownModule, NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { CelebritiesRoutingModule } from './celebrities-routing.module';
import { CelebritiesComponent } from './celebrities.component';


import { SidebarComponent } from "./_sub/sidebar/sidebar.component";
import { HeaderComponent } from "./_sub/header/header.component";
import { FooterComponent } from "./_sub/footer/footer.component";
import { PageHeaderModule } from "../shared/modules/page-header/page-header.module";
import { environment } from "../../environments/environment";
// import { EditorModule } from 'primeng/editor';


@NgModule({
  declarations: [
    CelebritiesComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    CelebritiesRoutingModule,
    TranslateModule,
    NgbDropdownModule,
    PageHeaderModule,
    NgbModule,
    // EditorModule
  ]
})
export class CelebritiesModule { }
