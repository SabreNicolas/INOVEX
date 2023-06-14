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
import { rapportsService } from './services/rapports.service';
import { rondierService } from './services/rondier.service';
import { TagAffectationComponent } from './tag-affectation/tag-affectation.component';
import { BadgeComponent } from './badge/badge.component';
import { ListBadgesComponent } from './list-badges/list-badges.component';
import { GestionBadgeComponent } from './gestion-badge/gestion-badge.component';
import { ZoneControleComponent } from './zone-controle/zone-controle.component';
import { ElementControleComponent } from './element-controle/element-controle.component';
import { ListZonesComponent } from './list-zones/list-zones.component';
import { ListElementsComponent } from './list-elements/list-elements.component';
import { PermisFeuComponent } from './permis-feu/permis-feu.component';
import { ReportingRondeComponent } from './reporting-ronde/reporting-ronde.component';
import { ModeOperatoireComponent } from './mode-operatoire/mode-operatoire.component';
import { ListModeOperatoireComponent } from './list-mode-operatoire/list-mode-operatoire.component';
import { ListConsignesComponent } from './list-consignes/list-consignes.component';
import { ConsigneComponent } from './consigne/consigne.component';
import { RondierFinMoisComponent } from './rondier-fin-mois/rondier-fin-mois.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { dateService } from './services/date.service';
import { TokenApiComponent } from './token-api/token-api.component';
import { tokenApiService } from './services/tokenApi.service';
import { ListEquipeComponent } from './list-equipe/list-equipe.component';
import { cahierQuartService } from './services/cahierQuart.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { cahierQuart } from './cahierQuart/cahierQuart.component.';
import { EquipeComponent } from './equipe/equipe.component';
import { GroupementComponent } from './groupement/groupement.component';
import { ListGroupementsComponent } from './list-groupements/list-groupements.component';
import { ImportTonnageComponent } from './import-tonnage/import-tonnage.component';
import { OutilsComponent } from './outils/outils.component';

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
    GestionUserComponent,
    TagAffectationComponent,
    BadgeComponent,
    ListBadgesComponent,
    GestionBadgeComponent,
    ZoneControleComponent,
    ElementControleComponent,
    ListZonesComponent,
    ListElementsComponent,
    PermisFeuComponent,
    ReportingRondeComponent,
    ModeOperatoireComponent,
    ListModeOperatoireComponent,
    ListConsignesComponent,
    ConsigneComponent,
    RondierFinMoisComponent,
    MaintenanceComponent,
    TokenApiComponent,
    ListEquipeComponent,
    cahierQuart,
    EquipeComponent,
    GroupementComponent,
    ListGroupementsComponent,
    ImportTonnageComponent,
    OutilsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DragDropModule
  ],
  providers: [
    moralEntitiesService,
    categoriesService,
    productsService,
    arretsService,
    DatePipe,
    loginService,
    AuthGuard,
    rapportsService,
    rondierService,
    dateService,
    tokenApiService,
    cahierQuartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
