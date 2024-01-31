import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {zone} from "../../models/zone.model";
import {badge} from "../../models/badge.model";
import {badgeAffect} from "../../models/badgeAffect.model";
import {user} from "../../models/user.model";
import {element} from "../../models/element.model";
import {permisFeu} from "../../models/permisFeu.model";
import {modeOP} from "../../models/modeOP.models";
import {ronde} from "../../models/ronde.models";
import {mesureRonde} from "../../models/mesureRonde.model";
import {consigne} from "../../models/consigne.model";
import {anomalie} from "../../models/anomalie.model";
import {elementsOfZone} from "../../models/elementsOfZone.model";
import {permisFeuValidation} from "../../models/permisfeu-validation.model";
import { idUsineService } from "./idUsine.service";

@Injectable()
export class rondierService {


    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    private portAPI = 3100;
    private ip = "fr-couvinove301.prod.paprec.fr";
    //private ip = "localhost";
    private idUsine : number | undefined;
    private idUser : number;

    constructor(private http: HttpClient, private idUsineService : idUsineService) {
        this.httpClient = http;
        this.idUsine = this.idUsineService.getIdUsine();
        this.idUser = this.idUsineService.getIdUser();
    }

    /*
    BADGE
    */

    //création du badge
    createBadge(uid : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/Badge?uid="+uid+"&idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //récupération du dernier Id inséré
    lastIdBadge(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/BadgeLastId";
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<number>(requete,requestOptions);
    }

    //liste des badges non affectés
    listBadgeNonAffect(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/BadgesLibre/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<badge[]>(requete,requestOptions);
    }

    //liste des badges affectés à une zone
    listBadgeZone(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/BadgesZone/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<badgeAffect[]>(requete,requestOptions);
    }

    //liste des badges affectés à un user
    listBadgeUser(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/BadgesUser/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<badgeAffect[]>(requete,requestOptions);
    }

    //Mis à jour de l'état d'activation du badge
    updateEnabled(id : number, enabled : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/BadgeEnabled/"+id+"/"+enabled;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //Update affectation
    updateAffect(id : number, idAffect : number, typeAffect : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/BadgeAffectation/"+id+"/"+typeAffect+"/"+idAffect;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //Update affectation => rendre le badge libre
    updateAffectLibre(id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/BadgeDeleteAffectation/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }


    /*
    FIN BADGE
     */

    /*
    ZONE DE CONTROLE
     */

    //création de la zone de controle
    createZone(nom : string, commentaire : string, four : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/zone?nom="+nom+"&commentaire="+commentaire+"&four="+four+"&idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //liste des zones de controle
    listZone(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/zones/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<zone[]>(requete,requestOptions);
    }

    //liste des zones de controle libres
    listZoneLibre(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/ZonesLibre/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<zone[]>(requete,requestOptions);
    }

    //Mise à jour du commentaire d'une zone de contrôle
    updateCommentaire(zoneId : number, commentaire : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/zoneCommentaire/"+zoneId+"/"+commentaire;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //Mise à jour du nom d'une zone de contrôle
    updateNomZone(zoneId : number, nom : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/zoneNom/"+zoneId+"?nom="+nom;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    deleteZone(id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/deleteZone?Id="+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }
    /*
    FIN ZONE DE CONTROLE
     */

    //Création d'un groupement
    createGroupement(zoneId : number, groupement : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/groupement?zoneId="+zoneId+"&groupement="+groupement;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //Récupérer tout les groupements d'une usine
    getAllGroupements(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getAllGroupements?idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<elementsOfZone[]>(requete,requestOptions);
    }

    //Récupérer un groupement
    getOneGroupement(idGroupement : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getOneGroupement?idGroupement="+idGroupement;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<element>(requete,requestOptions);
    }

    //Modifier un groupement
    updateGroupement(idGroupement : number, groupement : string, zoneId : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateGroupement?idGroupement="+idGroupement+"&groupement="+groupement+"&zoneId="+zoneId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    deleteGroupement(idGroupement : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/deleteGroupement?idGroupement="+idGroupement;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }


    /*
    ELEMENT DE CONTROLE
     */

    //création de l'élément de controle
    //?zoneId=1&nom=ddd&valeurMin=1.4&valeurMax=2.5&typeChamp=1&isFour=0&isGlobal=1&unit=tonnes&defaultValue=1.7&isRegulateur=0&listValues=1;2;3&isCompteur=1&ordre=5
    createElement(zoneId : number, nom : string, valeurMin : number, valeurMax : number, typeChamp : number, unit : string, defaultValue : number, isRegulateur : number, listValues : string, isCompteur : number, ordre : number, idGroupement : number, codeEquipement : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/element?zoneId="+zoneId+"&nom="+nom+"&valeurMin="+valeurMin+"&valeurMax="+valeurMax+"&typeChamp="+typeChamp+"&unit="+unit+"&defaultValue="+defaultValue+"&isRegulateur="+isRegulateur+"&listValues="+listValues+"&isCompteur="+isCompteur+"&ordre="+ordre +"&idGroupement="+idGroupement+"&codeEquipement="+codeEquipement;
        console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //update de l'élément de controle ayant comme id
    //?zoneId=1&nom=ddd&valeurMin=1.4&valeurMax=2.5&typeChamp=1&isFour=0&isGlobal=1&unit=tonnes&defaultValue=1.7&isRegulateur=0&listValues=1;2;3&isCompteur=1&ordre=5
    updateElement(Id : number, zoneId : number, nom : string, valeurMin : number, valeurMax : number, typeChamp : number, unit : string, defaultValue : number, isRegulateur : number, listValues : string, isCompteur : number, ordre : number, idGroupement : number, codeEquipement : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateElement/"+Id+"?zoneId="+zoneId+"&nom="+nom+"&valeurMin="+valeurMin+"&valeurMax="+valeurMax+"&typeChamp="+typeChamp+"&unit="+unit+"&defaultValue="+defaultValue+"&isRegulateur="+isRegulateur+"&listValues="+listValues+"&isCompteur="+isCompteur+"&ordre="+ordre+"&idGroupement="+idGroupement+"&codeEquipement="+codeEquipement;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    getElementsOfUsine(){
        
        let requete = "https://"+this.ip+":"+this.portAPI+"/elementsControleOfUsine/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<element>(requete,requestOptions);
    }

    changeTypeRecupSetRondier(Id : number, elementRondier: number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/productElementRondier?id="+Id+"&idElementRondier=" +elementRondier;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }
    

    //update de l'ordre des éléments ayant un ordre suppérieur à x pour une zone
    //?zoneId=1&ordre=2
    updateOrdreElement(zoneId : number, ordre : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateOrdreElement/?zoneId="+zoneId+"&maxOrdre="+ordre;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //delete 1 élément de controle
    deleteElement(Id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/deleteElement?id="+Id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }

    //Récupérer 1 élément
    getOneElement(Id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/element/"+Id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<element>(requete,requestOptions);
    }


    //liste des elements de controle d'une zone de controle
    listElementofZone(zoneId : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/elementsOfZone/"+zoneId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<element[]>(requete,requestOptions);
    }
    //Récupérer les groupements d'une zone
    getGroupements(zoneId : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getGroupements?zoneId="+zoneId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<element[]>(requete,requestOptions);
    }
    //liste des elements de controle de type compteur
    listElementCompteur(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/elementsCompteur/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<element[]>(requete,requestOptions);
    }


    listZonesAndElements(){

        if(this.idUsine != 7){
            let requete = "https://"+this.ip+":"+this.portAPI+"/BadgeAndElementsOfZone/"+this.idUsine;
            //console.log(requete);
    
            const requestOptions = {
                headers: new HttpHeaders(this.headerDict),
            };
    
            return this.http
                .get<elementsOfZone[]>(requete,requestOptions);
        }
        else {
            let requete = "https://"+this.ip+":"+this.portAPI+"/elementsOfUsine/"+this.idUsine;
            //console.log(requete);

            const requestOptions = {
                headers: new HttpHeaders(this.headerDict),
            };

            return this.http
                .get<elementsOfZone[]>(requete,requestOptions);
        }
        
    }

    listZonesAndElementsWithValues(rondeId : number){
            let requete = "https://"+this.ip+":"+this.portAPI+"/BadgeAndElementsOfZoneWithValues/"+this.idUsine+"/"+rondeId;
            //console.log(requete);
    
            const requestOptions = {
                headers: new HttpHeaders(this.headerDict),
            };
    
            return this.http
                .get<elementsOfZone[]>(requete,requestOptions);
      
    }

    /*
    FIN ELEMENT DE CONTROLE
     */


    /*
    MESURE RONDIER
     */
    //Update value element de controle sur une ronde
    updateMesureRondier(id: number, value: string | null){
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateMesureRonde?id="+id+"&value="+value;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //Récupérer la valeur pour un élément de contrôle et une date (quart de nuit => dernier de la journée)
    //?id=111&date=dhdhdh
    valueElementDay(id: number, date: string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/valueElementDay?id="+id+"&date="+date;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    /*
    FIN MESURE RONDIER
     */


    /*
    PERMIS DE FEU
     */

    //création du permis de feu
    //?dateHeureDeb=dggd&dateHeureFin=fff&badgeId=1?numero=ehgeheh
    createPermisFeu(dateHeureDeb: string | null, dateHeureFin: string | null, badgeId: number, zone : string, isPermisFeu : number, numero : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/PermisFeu?dateHeureDeb="+dateHeureDeb+"&dateHeureFin="+dateHeureFin+"&badgeId="+badgeId+"&zone="+zone+"&isPermisFeu="+isPermisFeu+"&numero="+numero;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //liste des permis de feu en cours
    listPermisFeu(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/PermisFeu/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<permisFeu[]>(requete,requestOptions);
    }

    //liste des validation de permis de feu
    //?dateHeure=xshhshx
    listPermisFeuValidation(dateHeure: String | undefined){
        let requete = "https://"+this.ip+":"+this.portAPI+"/PermisFeuVerification?dateHeure="+dateHeure+"&idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<permisFeuValidation[]>(requete,requestOptions);
    }


    /*
    FIN PERMIS DE FEU
     */

    /*
    MODE OP
     */
    //création du mode OP
    //?nom=dggd&fichier=fff&zoneId=1
    createModeOP(nom: string, fichier: File | undefined, zoneId: number){
        //utilisation de formData pour conserver le format du fichier
        const formData = new FormData();
        // @ts-ignore
        formData.append('fichier', fichier, fichier.name);
        let requete = "https://"+this.ip+":"+this.portAPI+"/modeOP?nom="+nom+"&zoneId="+zoneId;
        //console.log(fichier);

        const headers = new HttpHeaders();
        // @ts-ignore
        headers.append('Content-Type', null);
        headers.append('Accept', 'application/json');

        const requestOptions = {
            headers: headers,
        };

        return this.http
            .post<any>(requete,formData,requestOptions);
    }

    //liste des modeOP
    listModeOP(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/modeOPs/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<modeOP[]>(requete,requestOptions);
    }

    //delete modeOP
    deleteModeOP(id : number, nom : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/modeOP/"+id+"?nom="+nom;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }


    /*
    FIN MODE OP
     */


    /*
    RONDE
     */

    //liste des rondes pour une date donnée
    listRonde(date : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/Rondes?date="+date+"&idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<ronde[]>(requete,requestOptions);
    }

    //Affichage d'une ronde pour une date et un quart donnée
    affichageRonde(date: string, quart: number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/RondesQuart?date="+date+"&idUsine="+this.idUsine+"&quart="+quart;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<ronde[]>(requete,requestOptions);
    }

    //Reporting d'une ronde
    reportingRonde(idRonde : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/reportingRonde/"+idRonde;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<mesureRonde[]>(requete,requestOptions);
    }

    //Cloture de la ronde
    closeRonde(id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/closeRondeEnCours?id="+id+"&four1=1&four2=1";
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //delete ronde
    deleteRonde(id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/deleteRonde?id="+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }


    /*
    FIN RONDE
     */


    //liste des users sans badge
    listUserLibre(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/UsersLibre/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<user[]>(requete,requestOptions);
    }

    /*
    CONSIGNES
     */
    //création d'une consigne
    //?commentaire=dggd&dateFin=fff&type=1
    createConsigne(desc: string, type: number, dateFin: string | null, dateDebut: string | null){
        let requete = "https://"+this.ip+":"+this.portAPI+"/consigne?commentaire="+desc+"&dateFin="+dateFin+"&dateDebut=" + dateDebut + "&type="+type+"&idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //liste des consignes en cours de validité
    listConsignes(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/consignes/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<consigne[]>(requete,requestOptions);
    }

    //liste des consignes 
    listAllConsignes(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/allConsignes/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<consigne[]>(requete,requestOptions);
    }

    //delete consigne
    deleteConsigne(id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/consigne/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }

    /*
    FIN CONSIGNES
     */


    /*
    ANOMALIES
     */

    //liste des anomalies sur une ronde
    listAnomalies(id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/anomalies/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<anomalie[]>(requete,requestOptions);
    }

    updateAnomalie(rondeId : number,zoneId : number, commentaire : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateAnomalie?rondeId="+rondeId+"&zoneId="+zoneId +"&commentaire=" + commentaire;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<anomalie[]>(requete,requestOptions);
    }

    createAnomalie(rondeId : number, commentaire : string, zoneId : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/createAnomalie?rondeId="+rondeId + "&zoneId=" + zoneId +"&commentaire=" + commentaire;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<anomalie[]>(requete,requestOptions);
    }
    /*
    FIN ANOMALIES
    */

    /*
    NB LIGNE USINE
     */

    //Nombre de four dans l'usine
    nbLigne(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/nbLigne/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<number>(requete,requestOptions);
    }

    //Nombre de GTA dans l'usine
    nbGTA(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/nbGTA/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<number>(requete,requestOptions);
    }

    //Nombre de RCU dans l'usine
    nbRCU(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/nbRCU/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<number>(requete,requestOptions);
    }

    /*
    FIN NB LIGNE USINE
     */
}