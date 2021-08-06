import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoralEntitiesComponent } from './moral-entities/moral-entities.component';
import {ListMoralEntitiesComponent} from "./list-moral-entities/list-moral-entities.component";
import {CategoriesComponent} from "./categories/categories.component";
import {ListCategoriesComponent} from "./list-categories/list-categories.component";
import {ListEntreeComponent} from "./list-entree/list-entree.component";

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
        path: 'entree',
        component : ListEntreeComponent
    },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
