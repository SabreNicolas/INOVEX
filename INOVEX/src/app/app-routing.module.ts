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
import {AcceuilComponent} from "./acceuil/acceuil.component";
import {SaisieGlobalComponent} from "./saisie-global/saisie-global.component";
import {LoginComponent} from "./login/login.component";
import {UserComponent} from "./user/user.component";
import {ListUsersComponent} from "./list-users/list-users.component";
import {GestionUserComponent} from "./gestion-user/gestion-user.component";
import {AuthGuard} from "./services/auth-guard.service";
import {PciComponent} from "./pci/pci.component";

const routes: Routes = [

    {
        path : 'saisie',
        canActivate: [AuthGuard],
        component : SaisieGlobalComponent,
        children: [
            { path: '', canActivate: [AuthGuard], component:  ListEntreeComponent },
            { path: 'listClients', canActivate: [AuthGuard], component: ListMoralEntitiesComponent },
            { path: 'entree', canActivate: [AuthGuard], component : ListEntreeComponent },
            { path: 'sortie', canActivate: [AuthGuard], component : ListSortantsComponent },
            { path : 'listCompteurs', canActivate: [AuthGuard], component: ListCompteursComponent },
            { path: 'analyses', canActivate: [AuthGuard], component: AnalysesComponent },
            { path : 'conso', canActivate: [AuthGuard], component : ListConsoComponent },
            { path : 'arrets', canActivate: [AuthGuard], component : ArretsComponent },
            { path : 'listArrets', canActivate: [AuthGuard], component : ListArretsComponent },
            { path : 'pci', canActivate: [AuthGuard], component : PciComponent },
        ]
    },

    {
        path : 'acceuil',
        canActivate: [AuthGuard],
        component : AcceuilComponent
    },

    {
        path: 'clients',
        canActivate: [AuthGuard],
        component: MoralEntitiesComponent
    },

    {
        path : 'qse',
        canActivate: [AuthGuard],
        component: ListQseComponent
    },

    {
        path : '',
        component : LoginComponent
    },

    {
        path : 'rapports',
        canActivate: [AuthGuard],
        component : ListRapportsComponent
    },

    {
        path : 'gestionUser',
        canActivate: [AuthGuard],
        component : GestionUserComponent
    },


    {
        path : 'admin',
        canActivate: [AuthGuard],
        component : AdminGlobalComponent,
        children: [
            { path: '', canActivate: [AuthGuard], component:  AdminComponent },
            { path: 'modification', canActivate: [AuthGuard], component:  AdminComponent },
            { path: 'newCompteur', canActivate: [AuthGuard], component:  CompteursComponent },
            { path: 'newSortant', canActivate: [AuthGuard], component:  SortantsComponent },
            { path: 'newAnalyse', canActivate: [AuthGuard], component:  NewAnalyseComponent },
            { path: 'newConso', canActivate: [AuthGuard], component:  ConsoComponent },
            { path: 'newCategorie', canActivate: [AuthGuard], component: CategoriesComponent},
            { path: 'clients', canActivate: [AuthGuard], component: MoralEntitiesComponent},
            { path: 'newUser', canActivate: [AuthGuard], component: UserComponent},
            { path: 'users', canActivate: [AuthGuard], component: ListUsersComponent},
        ]
    },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
