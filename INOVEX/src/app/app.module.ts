import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoralEntitiesComponent } from './moral-entities/moral-entities.component';
import {HttpClientModule} from "@angular/common/http";
import {moralEntitiesService} from "./services/moralentities.service";
import {productsService} from "./services/products.service";
import { ListMoralEntitiesComponent } from './list-moral-entities/list-moral-entities.component';
import { CategoriesComponent } from './categories/categories.component';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import {categoriesService} from "./services/categories.service";
import { ListEntreeComponent } from './list-entree/list-entree.component';
import { ListCompteursComponent } from './list-compteurs/list-compteurs.component';
import { CompteursComponent } from './compteurs/compteurs.component';
import { AnalysesComponent } from './analyses/analyses.component';
import { ListSortantsComponent } from './list-sortants/list-sortants.component';
import { ListConsoComponent } from './list-conso/list-conso.component';
import { ListRapportsComponent } from './list-rapports/list-rapports.component';
import {arretsService} from "./services/arrets.service";
import { ListArretsComponent } from './list-arrets/list-arrets.component';
import { ArretsComponent } from './arrets/arrets.component';
import {DatePipe} from "@angular/common";
import { AdminComponent } from './admin/admin.component';
import { AdminGlobalComponent } from './admin-global/admin-global.component';
import { SortantsComponent } from './sortants/sortants.component';
import { NewAnalyseComponent } from './new-analyse/new-analyse.component';
import { ConsoComponent } from './conso/conso.component';
import { ListQseComponent } from './list-qse/list-qse.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { SaisieGlobalComponent } from './saisie-global/saisie-global.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import {loginService} from "./services/login.service";
import { ListUsersComponent } from './list-users/list-users.component';
import { GestionUserComponent } from './gestion-user/gestion-user.component';
import {AuthGuard} from "./services/auth-guard.service";

@NgModule({
  declarations: [
    AppComponent,
    MoralEntitiesComponent,
    ListMoralEntitiesComponent,
    CategoriesComponent,
    ListCategoriesComponent,
    ListEntreeComponent,
    ListCompteursComponent,
    CompteursComponent,
    AnalysesComponent,
    ListSortantsComponent,
    ListConsoComponent,
    ListRapportsComponent,
    ListArretsComponent,
    ArretsComponent,
    AdminComponent,
    AdminGlobalComponent,
    SortantsComponent,
    NewAnalyseComponent,
    ConsoComponent,
    ListQseComponent,
    AcceuilComponent,
    SaisieGlobalComponent,
    LoginComponent,
    UserComponent,
    ListUsersComponent,
    GestionUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    moralEntitiesService,
    categoriesService,
    productsService,
    arretsService,
    DatePipe,
    loginService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
