import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { FormComponent } from './form/form.component';
import { ListCelebritiesComponent } from './list-celebrities/list-celebrities.component';


const routes: Routes = [
  {path: '', component: CategoriesComponent},
  {path: 'add', component: FormComponent},
  {path: 'update/:id', component: FormComponent},
  {path: 'list/:id', component: ListCelebritiesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
