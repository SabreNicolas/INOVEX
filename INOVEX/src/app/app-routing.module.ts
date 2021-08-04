import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoralEntitiesComponent } from './moral-entities/moral-entities.component';
import {ListMoralEntitiesComponent} from "./list-moral-entities/list-moral-entities.component";
import {CategoriesComponent} from "./categories/categories.component";
import {ListCategoriesComponent} from "./list-categories/list-categories.component";

const routes: Routes = [
    {
        path: 'clients',
        component: MoralEntitiesComponent
    },

  {
    path: 'listClients',
    component: ListMoralEntitiesComponent
  },

    {
        path: 'categories',
        component: CategoriesComponent
    },

    {
        path: 'listCategories',
        component: ListCategoriesComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
