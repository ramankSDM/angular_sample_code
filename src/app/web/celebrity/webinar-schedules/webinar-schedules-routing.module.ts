import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebinarSchedulesComponent } from './webinar-schedules.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  {path: '', component: WebinarSchedulesComponent},
  {path: 'add', component: FormComponent},
  {path: 'update/:id', component: FormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebinarSchedulesRoutingModule { }
