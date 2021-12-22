import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FansComponent } from './fans.component';
import { FormComponent } from './form/form.component';


const routes: Routes = [
  {path: '', component: FansComponent},
  {path: 'add', component: FormComponent},
  {path: 'update/:id', component: FormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FansRoutingModule { }
