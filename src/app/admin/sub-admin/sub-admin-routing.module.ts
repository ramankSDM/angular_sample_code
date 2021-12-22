import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubAdminComponent } from './sub-admin.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  {path: '', component: SubAdminComponent},
  {path: 'add', component: FormComponent},
  {path: 'update/:id', component: FormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubAdminRoutingModule { }
