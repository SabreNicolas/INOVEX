import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {zone} from "../../models/zone.model";
import {badge} from "../../models/badge.model";
import {badgeAffect} from "../../models/badgeAffect.model";
import {user} from "../../models/user.model";
import {element} from "../../models/element.model";

@Injectable()
export class rondierService {

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    private portAPI = 3000;
    private ip = "192.168.172.17";

    constructor(private http: HttpClient) {
        this.httpClient = http;
    }

    /*
    BADGE
     */

    //création du badge
    createBadge(uid : string){
        let requete = "http://"+this.ip+":"+this.portAPI+"/Badge?uid="+uid;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //récupération du dernier Id inséré
    lastIdBadge(){
        let requete = "http://"+this.ip+":"+this.portAPI+"/BadgeLastId";
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<number>(requete,requestOptions);
    }

    //liste des badges non affectés
    listBadgeNonAffect(){
        let requete = "http://"+this.ip+":"+this.portAPI+"/BadgesLibre";
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<badge[]>(requete,requestOptions);
    }

    //liste des badges affectés à une zone
    listBadgeZone(){
        let requete = "http://"+this.ip+":"+this.portAPI+"/BadgesZone";
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<badgeAffect[]>(requete,requestOptions);
    }

    //liste des badges affectés à un user
    listBadgeUser(){
        let requete = "http://"+this.ip+":"+this.portAPI+"/BadgesUser";
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<badgeAffect[]>(requete,requestOptions);
    }

    //Mis à jour de l'état d'activation du badge
    updateEnabled(id : number, enabled : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/BadgeEnabled/"+id+"/"+enabled;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //Update affectation
    updateAffect(id : number, idAffect : number, typeAffect : string){
        let requete = "http://"+this.ip+":"+this.portAPI+"/BadgeAffectation/"+id+"/"+typeAffect+"/"+idAffect;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //Update affectation => rendre le badge libre
    updateAffectLibre(id : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/BadgeDeleteAffectation/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }


    /*
    FIN BADGE
     */

    /*
    ZONE DE CONTROLE
     */

    //création de la zone de controle
    createZone(nom : string, commentaire : string){
        let requete = "http://"+this.ip+":"+this.portAPI+"/zone?nom="+nom+"&commentaire="+commentaire;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //liste des zones de controle
    listZone(){
        let requete = "http://"+this.ip+":"+this.portAPI+"/zones";
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<zone[]>(requete,requestOptions);
    }

    //liste des zones de controle libres
    listZoneLibre(){
        let requete = "http://"+this.ip+":"+this.portAPI+"/ZonesLibre";
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<zone[]>(requete,requestOptions);
    }

    //Mise à jour du commentaire d'une zone de contrôle
    updateCommentaire(zoneId : number, commentaire : string){
        let requete = "http://"+this.ip+":"+this.portAPI+"/zoneCommentaire/"+zoneId+"/"+commentaire;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }


    /*
    FIN ZONE DE CONTROLE
     */


    /*
    ELEMENT DE CONTROLE
     */

    //création de l'élément de controle
    //?zoneId=1&nom=ddd&valeurMin=1.4&valeurMax=2.5&typeChamp=1&isFour=0&isGlobal=1&unit=tonnes&defaultValue=1.7&isRegulateur=0
    createElement(zoneId : number, nom : string, valeurMin : number, valeurMax : number, typeChamp : number, isFour : number, isGlobal : number, unit : string, defaultValue : number, isRegulateur : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/element?zoneId="+zoneId+"&nom="+nom+"&valeurMin="+valeurMin+"&valeurMax="+valeurMax+"&typeChamp="+typeChamp+"&isFour="+isFour+"&isGlobal="+isGlobal+"&unit="+unit+"&defaultValue="+defaultValue+"&isRegulateur="+isRegulateur;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //liste des elements de controle d'une zone de controle
    listElementofZone(zoneId : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/elementsOfZone/"+zoneId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<element[]>(requete,requestOptions);
    }



    /*
    FIN ELEMENT DE CONTROLE
     */

    //liste des users sans badge
    listUserLibre(){
        let requete = "http://"+this.ip+":"+this.portAPI+"/UsersLibre";
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<user[]>(requete,requestOptions);
    }
}