import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoralEntitiesComponent } from './moral-entities/moral-entities.component';
import {ListMoralEntitiesComponent} from "./list-moral-entities/list-moral-entities.component";
import {CategoriesComponent} from "./categories/categories.component";
import {ListCategoriesComponent} from "./list-categories/list-categories.component";
import {ListEntreeComponent} from "./list-entree/list-entree.component";
import { CompteursComponent } from './compteurs/compteurs.component';
import { ListCompteursComponent } from './list-compteurs/list-compteurs.component';
import { AnalysesComponent } from './analyses/analyses.component';
import {ListSortantsComponent} from "./list-sortants/list-sortants.component";
import {ListConsoComponent} from "./list-conso/list-conso.component";
import {ListRapportsComponent} from "./list-rapports/list-rapports.component";
import {ArretsComponent} from "./arrets/arrets.component";
import {ListArretsComponent} from "./list-arrets/list-arrets.component";

const routes: Routes = [
    {
        path : '',
        component : ListEntreeComponent
    },

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

    {
        path: 'sortie',
        component : ListSortantsComponent
    },

    {
        path: 'compteurs',
        component: CompteursComponent
    },

    {
        path : 'listCompteurs',
        component: ListCompteursComponent
    },

    {
        path: 'analyses',
        component: AnalysesComponent
    },

    {
        path : 'conso',
        component : ListConsoComponent
    },

    {
        path : 'rapports',
        component : ListRapportsComponent
    },

    {
        path : 'arrets',
        component : ArretsComponent
    },

    {
        path : 'listArrets',
        component : ListArretsComponent
    },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
