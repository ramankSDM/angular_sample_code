import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqsComponent } from './faqs.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  {path: '', component: FaqsComponent},
  {path: 'add', component: FormComponent},
  {path: 'update/:id', component: FormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqsRoutingModule { }
