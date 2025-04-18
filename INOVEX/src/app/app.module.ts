import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MoralEntitiesComponent } from "./moral-entities/moral-entities.component";
import { HttpClientModule } from "@angular/common/http";
import { moralEntitiesService } from "./services/moralentities.service";
import { productsService } from "./services/products.service";
import { ListMoralEntitiesComponent } from "./list-moral-entities/list-moral-entities.component";
import { CategoriesComponent } from "./categories/categories.component";
import { ListCategoriesComponent } from "./list-categories/list-categories.component";
import { categoriesService } from "./services/categories.service";
import { ListEntreeComponent } from "./list-entree/list-entree.component";
import { ListCompteursComponent } from "./list-compteurs/list-compteurs.component";
import { CompteursComponent } from "./compteurs/compteurs.component";
import { AnalysesComponent } from "./analyses/analyses.component";
import { ListSortantsComponent } from "./list-sortants/list-sortants.component";
import { ListConsoComponent } from "./list-conso/list-conso.component";
import { ListRapportsComponent } from "./list-rapports/list-rapports.component";
import { arretsService } from "./services/arrets.service";
import { ListArretsComponent } from "./list-arrets/list-arrets.component";
import { ArretsComponent } from "./arrets/arrets.component";
import { DatePipe, registerLocaleData } from "@angular/common";
import { AdminComponent } from "./admin/admin.component";
import { AdminGlobalComponent } from "./admin-global/admin-global.component";
import { SortantsComponent } from "./sortants/sortants.component";
import { NewAnalyseComponent } from "./new-analyse/new-analyse.component";
import { ConsoComponent } from "./conso/conso.component";
import { ListQseComponent } from "./list-qse/list-qse.component";
import { AcceuilComponent } from "./acceuil/acceuil.component";
import { SaisieGlobalComponent } from "./saisie-global/saisie-global.component";
import { LoginComponent } from "./login/login.component";
import { UserComponent } from "./user/user.component";
import { loginService } from "./services/login.service";
import { ListUsersComponent } from "./list-users/list-users.component";
import { GestionUserComponent } from "./gestion-user/gestion-user.component";
import { AuthGuard } from "./services/auth-guard.service";
import { rapportsService } from "./services/rapports.service";
import { rondierService } from "./services/rondier.service";
import { TagAffectationComponent } from "./tag-affectation/tag-affectation.component";
import { BadgeComponent } from "./badge/badge.component";
import { ListBadgesComponent } from "./list-badges/list-badges.component";
import { GestionBadgeComponent } from "./gestion-badge/gestion-badge.component";
import { ZoneControleComponent } from "./zone-controle/zone-controle.component";
import { ElementControleComponent } from "./element-controle/element-controle.component";
import { ListZonesComponent } from "./list-zones/list-zones.component";
import { ListElementsComponent } from "./list-elements/list-elements.component";
import { PermisFeuComponent } from "./permis-feu/permis-feu.component";
import { ReportingRondeComponent } from "./reporting-ronde/reporting-ronde.component";
import { ModeOperatoireComponent } from "./mode-operatoire/mode-operatoire.component";
import { ListModeOperatoireComponent } from "./list-mode-operatoire/list-mode-operatoire.component";
import { ListConsignesComponent } from "./list-consignes/list-consignes.component";
import { ConsigneComponent } from "./consigne/consigne.component";
import { RondierFinMoisComponent } from "./rondier-fin-mois/rondier-fin-mois.component";
import { MaintenanceComponent } from "./maintenance/maintenance.component";
import { dateService } from "./services/date.service";
import { TokenApiComponent } from "./token-api/token-api.component";
import { tokenApiService } from "./services/tokenApi.service";
import { ListEquipeComponent } from "./list-equipe/list-equipe.component";
import { cahierQuartService } from "./services/cahierQuart.service";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { cahierQuart } from "./cahierQuart/cahierQuart.component";
import { EquipeComponent } from "./equipe/equipe.component";
import { GroupementComponent } from "./groupement/groupement.component";
import { ListGroupementsComponent } from "./list-groupements/list-groupements.component";
import { ImportTonnageComponent } from "./import-tonnage/import-tonnage.component";
import { OutilsComponent } from "./outils/outils.component";
import { CorrespondanceSortantsComponent } from "./correspondance-sortants/correspondance-sortants.component";
import { idUsineService } from "./services/idUsine.service";
import { ListReactifsComponent } from "./list-reactifs/list-reactifs.component";
import { CorrespondanceReactifsComponent } from "./correspondance-reactifs/correspondance-reactifs.component";
import { FormulaireComponent } from "./formulaire/formulaire.component";
import { ListFormulairesComponent } from "./list-formulaires/list-formulaires.component";
import { formulaireService } from "./services/formulaire.service";
import { SaisieFormulaireComponent } from "./saisie-formulaire/saisie-formulaire.component";
import { ListActionsComponent } from "./list-actions/list-actions.component";
import { ActionComponent } from "./action/action.component";
import { ActuComponent } from "./actu/actu.component";
import { ListActusComponent } from "./list-actus/list-actus.component";
import { EvenementComponent } from "./evenement/evenement.component";
import { ListEvenementsComponent } from "./list-evenements/list-evenements.component";
import { CalendrierComponent } from "./calendrier/calendrier.component";
import { CommonModule } from "@angular/common";
import { FlatpickrModule } from "angularx-flatpickr";
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarNativeDateFormatter,
  DateAdapter,
  DateFormatterParams,
} from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import localeFr from "@angular/common/locales/fr";
import { AcceuilCahierQuartComponent } from "./acceuil-cahier-quart/acceuil-cahier-quart.component";
import { RecapRondeComponent } from "./recap-ronde/recap-ronde.component";
import { EnregistrementEquipeComponent } from "./enregistrement-equipe/enregistrement-equipe.component";
import { ListEnregistrementEquipeComponent } from "./list-enregistrement-equipe/list-enregistrement-equipe.component";
import { RechercheComponent } from "./recherche/recherche.component";
import { ListAnomaliesComponent } from "./list-anomalies/list-anomalies.component";
import { ListLiensExternesComponent } from "./list-liens-externes/list-liens-externes.component";
import { LiensExternesComponent } from "./liens-externes/liens-externes.component";
import { RecapRondePrecedenteComponent } from "./recap-ronde-precedente/recap-ronde-precedente.component";
import { RecapRondeListeComponent } from "./recap-ronde-liste/recap-ronde-liste.component";
import { PopupService } from "./services/popup.service";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSelectModule } from "@angular/material/select";
import { MatDividerModule } from "@angular/material/divider";
import { MatInputModule } from "@angular/material/input";
import { PreventDoubleClickDirective } from "./prevent-double-click";
import { MatAccordion, MatExpansionModule } from "@angular/material/expansion";
import { ListActionsEnregistreesComponent } from "./list-actions-enregistrees/list-actions-enregistrees.component";

registerLocaleData(localeFr, "fr");
class CustomDateFormatter extends CalendarNativeDateFormatter {
  public override dayViewHour({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  }

  public override weekViewHour({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  }
}
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
    CorrespondanceSortantsComponent,
    ListReactifsComponent,
    CorrespondanceReactifsComponent,
    FormulaireComponent,
    ListFormulairesComponent,
    SaisieFormulaireComponent,
    ListActionsComponent,
    ActionComponent,
    ActuComponent,
    ListActusComponent,
    EvenementComponent,
    ListEvenementsComponent,
    CalendrierComponent,
    AcceuilCahierQuartComponent,
    RecapRondeComponent,
    EnregistrementEquipeComponent,
    ListEnregistrementEquipeComponent,
    RechercheComponent,
    ListAnomaliesComponent,
    ListLiensExternesComponent,
    LiensExternesComponent,
    RecapRondePrecedenteComponent,
    RecapRondeListeComponent,
    PreventDoubleClickDirective,
    ListActionsEnregistreesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    CommonModule,
    FormsModule,
    NgbModalModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatDialogModule,
    MatExpansionModule,
    MatAccordion,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTabsModule,
    MatSelectModule,
    MatDividerModule,
    MatInputModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    moralEntitiesService,
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
    categoriesService,
    productsService,
    arretsService,
    PopupService,
    DatePipe,
    loginService,
    AuthGuard,
    rapportsService,
    rondierService,
    dateService,
    tokenApiService,
    cahierQuartService,
    idUsineService,
    formulaireService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
