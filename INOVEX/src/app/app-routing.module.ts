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
import { TagAffectationComponent } from './tag-affectation/tag-affectation.component';
import {BadgeComponent} from "./badge/badge.component";
import {ListBadgesComponent} from "./list-badges/list-badges.component";
import {ZoneControleComponent} from "./zone-controle/zone-controle.component";
import {ElementControleComponent} from "./element-controle/element-controle.component";
import {ListZonesComponent} from "./list-zones/list-zones.component";
import {ListElementsComponent} from "./list-elements/list-elements.component";
import {GestionBadgeComponent} from "./gestion-badge/gestion-badge.component";
import {PermisFeuComponent} from "./permis-feu/permis-feu.component";
import {ReportingRondeComponent} from "./reporting-ronde/reporting-ronde.component";
import {ModeOperatoireComponent} from "./mode-operatoire/mode-operatoire.component";
import {ListModeOperatoireComponent} from "./list-mode-operatoire/list-mode-operatoire.component";
import {ListConsignesComponent} from "./list-consignes/list-consignes.component";
import {ConsigneComponent} from "./consigne/consigne.component";
import {RondierFinMoisComponent} from "./rondier-fin-mois/rondier-fin-mois.component";
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { TokenApiComponent } from './token-api/token-api.component';
import { ListEquipeComponent } from './list-equipe/list-equipe.component';
import { cahierQuart } from './cahierQuart/cahierQuart.component';
import { EquipeComponent } from './equipe/equipe.component';
import { GroupementComponent } from './groupement/groupement.component';
import { ListGroupementsComponent } from './list-groupements/list-groupements.component';
import { ImportTonnageComponent } from './import-tonnage/import-tonnage.component';
import { OutilsComponent } from './outils/outils.component';
import { CorrespondanceSortantsComponent } from './correspondance-sortants/correspondance-sortants.component';
import { ListReactifsComponent } from './list-reactifs/list-reactifs.component';
import { CorrespondanceReactifsComponent } from './correspondance-reactifs/correspondance-reactifs.component';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { ListFormulairesComponent } from './list-formulaires/list-formulaires.component';
import { SaisieFormulaireComponent } from './saisie-formulaire/saisie-formulaire.component';
import { ActuComponent } from './actu/actu.component';
import { ListActusComponent } from './list-actus/list-actus.component';
import { EvenementComponent } from './evenement/evenement.component';
import { ListEvenementsComponent } from './list-evenements/list-evenements.component';
import { CalendrierComponent } from './calendrier/calendrier.component';
import { AcceuilCahierQuartComponent } from './acceuil-cahier-quart/acceuil-cahier-quart.component';
import { RecapRondeComponent } from './recap-ronde/recap-ronde.component';
import { ListActionsComponent } from './list-actions/list-actions.component';
import { ActionComponent } from './action/action.component';
import { EnregistrementEquipeComponent } from './enregistrement-equipe/enregistrement-equipe.component';
import { ListEnregistrementEquipeComponent } from './list-enregistrement-equipe/list-enregistrement-equipe.component';
import { RechercheComponent } from './recherche/recherche.component';

const routes: Routes = [

    {
        path : 'saisie',
        canActivate: [AuthGuard],
        component : SaisieGlobalComponent,
        // component : MaintenanceComponent,
        children: [
            { path : '', canActivate: [AuthGuard], component:  ArretsComponent },
            { path : 'listClients', canActivate: [AuthGuard], component: ListMoralEntitiesComponent },
            { path : 'entree', canActivate: [AuthGuard], component : ListEntreeComponent },
            { path : 'sortie', canActivate: [AuthGuard], component : ListSortantsComponent },
            { path : 'reactifs', canActivate: [AuthGuard], component : ListReactifsComponent },
            { path : 'listCompteurs', canActivate: [AuthGuard], component: ListCompteursComponent },
            { path : 'analyses', canActivate: [AuthGuard], component: AnalysesComponent },
            { path : 'conso', canActivate: [AuthGuard], component : ListConsoComponent },
            { path : 'arrets', canActivate: [AuthGuard], component : ArretsComponent },
            { path : 'listArrets', canActivate: [AuthGuard], component : ListArretsComponent },
            { path : 'listForm', canActivate: [AuthGuard], component: ListFormulairesComponent},
            { path : 'saisieForm', canActivate: [AuthGuard], component: SaisieFormulaireComponent},

        ]
    },

    {
        path : 'accueil',
        canActivate: [AuthGuard],
        component : AcceuilComponent
        // component : MaintenanceComponent
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
        path : 'reporting',
        canActivate: [AuthGuard],
        component : ReportingRondeComponent
    },

    {
        path : 'cahierQuart',
        canActivate: [AuthGuard],
        component : cahierQuart,
        children : [
            { path : '', canActivate: [AuthGuard], component: AcceuilCahierQuartComponent },
            { path : 'listEquipe', canActivate: [AuthGuard], component: ListEquipeComponent },
            { path : 'newEquipe', canActivate: [AuthGuard], component: EquipeComponent },
            { path : 'outils', canActivate: [AuthGuard], component: OutilsComponent },
            { path: 'newConsigne', canActivate: [AuthGuard], component: ConsigneComponent},
            { path: 'consignes', canActivate: [AuthGuard], component: ListConsignesComponent},
            { path: 'newActu', canActivate: [AuthGuard], component: ActuComponent},
            { path: 'actu', canActivate: [AuthGuard], component: ListActusComponent},
            { path: 'newEvenement', canActivate: [AuthGuard], component: EvenementComponent},
            { path: 'evenement', canActivate: [AuthGuard], component: ListEvenementsComponent},
            { path : 'calendrier', canActivate: [AuthGuard], component: CalendrierComponent},
            { path : 'acceuil', canActivate: [AuthGuard], component: AcceuilCahierQuartComponent},
            { path : 'recapRonde', canActivate: [AuthGuard], component: RecapRondeComponent},
            { path : 'action', canActivate: [AuthGuard], component: ListActionsComponent},
            { path : 'newAction', canActivate: [AuthGuard], component: ActionComponent},
            { path : 'newEnregistrementEquipe', canActivate: [AuthGuard], component: EnregistrementEquipeComponent},
            { path : 'enregistrementEquipe', canActivate: [AuthGuard], component: ListEnregistrementEquipeComponent},
            { path : 'recherche', canActivate: [AuthGuard], component: RechercheComponent},
        ]
    },

    {
        path : 'admin',
        canActivate: [AuthGuard],
        component : AdminGlobalComponent,
        // component : MaintenanceComponent,
        children: [
            { path: '', canActivate: [AuthGuard], component:  AdminComponent },
            { path: 'token', canActivate: [AuthGuard], component:  TokenApiComponent },
            { path: 'import', canActivate: [AuthGuard], component:  ImportTonnageComponent },
            { path: 'modification', canActivate: [AuthGuard], component:  AdminComponent },
            { path: 'newCompteur', canActivate: [AuthGuard], component:  CompteursComponent },
            { path: 'newSortant', canActivate: [AuthGuard], component:  SortantsComponent },
            { path: 'newAnalyse', canActivate: [AuthGuard], component:  NewAnalyseComponent },
            { path: 'newConso', canActivate: [AuthGuard], component:  ConsoComponent },
            { path: 'newCategorie', canActivate: [AuthGuard], component: CategoriesComponent},
            { path: 'clients', canActivate: [AuthGuard], component: MoralEntitiesComponent},
            { path: 'newUser', canActivate: [AuthGuard], component: UserComponent},
            { path: 'users', canActivate: [AuthGuard], component: ListUsersComponent},
            { path: 'tags', canActivate: [AuthGuard], component: TagAffectationComponent},
            { path: 'newBadge', canActivate: [AuthGuard], component: BadgeComponent},
            { path: 'badges', canActivate: [AuthGuard], component: ListBadgesComponent},
            { path: 'gestionBadge', canActivate: [AuthGuard], component: GestionBadgeComponent},
            { path: 'newZone', canActivate: [AuthGuard], component: ZoneControleComponent},
            { path: 'zones', canActivate: [AuthGuard], component: ListZonesComponent},
            { path: 'newElement', canActivate: [AuthGuard], component: ElementControleComponent},
            { path: 'elements', canActivate: [AuthGuard], component: ListElementsComponent},
            { path: 'newGroupement', canActivate: [AuthGuard], component: GroupementComponent},
            { path: 'groupement', canActivate: [AuthGuard], component: ListGroupementsComponent},
            { path: 'permisFeu', canActivate: [AuthGuard], component: PermisFeuComponent},
            { path: 'reporting', canActivate: [AuthGuard], component: ReportingRondeComponent},
            { path: 'newModeOP', canActivate: [AuthGuard], component: ModeOperatoireComponent},
            { path: 'modesOP', canActivate: [AuthGuard], component: ListModeOperatoireComponent},
            { path: 'newConsigne', canActivate: [AuthGuard], component: ConsigneComponent},
            { path: 'consignes', canActivate: [AuthGuard], component: ListConsignesComponent},
            { path: 'finMois', canActivate: [AuthGuard], component: RondierFinMoisComponent},
            { path: 'correspondanceSortants', canActivate: [AuthGuard], component: CorrespondanceSortantsComponent},
            { path: 'CorrespondanceReactifs', canActivate: [AuthGuard], component: CorrespondanceReactifsComponent},
            { path: 'newForm', canActivate: [AuthGuard], component: FormulaireComponent},
            { path: 'forms', canActivate: [AuthGuard], component: ListFormulairesComponent},
            { path: 'saisieForm', canActivate: [AuthGuard], component: SaisieFormulaireComponent},

        ]
    },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
