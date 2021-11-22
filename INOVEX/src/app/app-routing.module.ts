import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoralEntitiesComponent } from './moral-entities/moral-entities.component';
import {ListMoralEntitiesComponent} from "./list-moral-entities/list-moral-entities.component";
import {ListEntreeComponent} from "./list-entree/list-entree.component";
import { CompteursComponent } from './compteurs/compteurs.component';
import { ListCompteursComponent } from './list-compteurs/list-compteurs.component';
import { AnalysesComponent } from './analyses/analyses.component';
import {ListSortantsComponent} from "./list-sortants/list-sortants.component";
import {ListConsoComponent} from "./list-conso/list-conso.component";
import {ListRapportsComponent} from "./list-rapports/list-rapports.component";
import {ArretsComponent} from "./arrets/arrets.component";
import {ListArretsComponent} from "./list-arrets/list-arrets.component";
import {AdminComponent} from "./admin/admin.component";
import {AdminGlobalComponent} from "./admin-global/admin-global.component";
import {SortantsComponent} from "./sortants/sortants.component";
import {ConsoComponent} from "./conso/conso.component";
import {NewAnalyseComponent} from "./new-analyse/new-analyse.component";
import {CategoriesComponent} from "./categories/categories.component";
import { ListQseComponent } from './list-qse/list-qse.component';
import {AppComponent} from "./app.component";
import {AcceuilComponent} from "./acceuil/acceuil.component";
import {SaisieGlobalComponent} from "./saisie-global/saisie-global.component";
import {LoginComponent} from "./login/login.component";
import {UserComponent} from "./user/user.component";

const routes: Routes = [

    {
        path : 'saisie',
        component : SaisieGlobalComponent,
        children: [
            { path: '', component:  ListEntreeComponent },
            { path: 'listClients', component: ListMoralEntitiesComponent },
            { path: 'entree', component : ListEntreeComponent },
            { path: 'sortie', component : ListSortantsComponent },
            { path : 'listCompteurs', component: ListCompteursComponent },
            { path: 'analyses', component: AnalysesComponent },
            { path : 'conso', component : ListConsoComponent },
            { path : 'arrets', component : ArretsComponent },
            { path : 'listArrets', component : ListArretsComponent },
        ]
    },

    {
        path : '',
        component : AcceuilComponent
    },

    {
        path: 'clients',
        component: MoralEntitiesComponent
    },

    {
        path : 'qse',
        component: ListQseComponent
    },

    {
        path : 'login',
        component : LoginComponent
    },

    {
        path : 'user',
        component : UserComponent
    },

    {
        path : 'rapports',
        component : ListRapportsComponent
    },


    {
        path : 'admin',
        component : AdminGlobalComponent,
        children: [
            { path: '', component:  AdminComponent },
            { path: 'modification', component:  AdminComponent },
            { path: 'newCompteur', component:  CompteursComponent },
            { path: 'newSortant', component:  SortantsComponent },
            { path: 'newAnalyse', component:  NewAnalyseComponent },
            { path: 'newConso', component:  ConsoComponent },
            { path: 'newCategorie', component: CategoriesComponent},
            { path: 'clients', component: MoralEntitiesComponent},
            { path : 'newUser', component : UserComponent},
        ]
    },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
