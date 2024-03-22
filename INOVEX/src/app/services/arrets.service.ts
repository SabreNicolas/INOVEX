import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {arret} from "../../models/arrets.model";
import {sumArret} from "../../models/sumArret.model";
import {depassement} from "../../models/depassement.model";
import {sumDepassement} from "../../models/sumDepassement.model";
import { idUsineService } from "./idUsine.service";

@Injectable()
export class arretsService {

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    private portAPI = 3100;
    private ip = "fr-couvinove301.prod.paprec.fr";
    //private ip = "localhost";
    private idUsine : number | undefined;

    constructor(private http: HttpClient, private idUsineService : idUsineService) {
        this.httpClient = http;
        //@ts-ignore
        this.idUsine = this.idUsineService.getIdUsine();
    }


    /**
     * DEPASSEMENTS
     */

    //insérer un dépassement
    createDepassement(dateDebut : string, dateFin : string, duree : number, idUser : number, dateSaisie : string, description : string, productId : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/Depassement?dateDebut="+dateDebut+"&dateFin="+dateFin+"&duree="+duree+"&user="+idUser+"&dateSaisie="+dateSaisie+"&description="+description+"&productId="+productId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //récupérer l'historique des arrêts pour un mois
    getDepassements(dateDebut : string, dateFin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/Depassements/"+dateDebut+"/"+dateFin+"/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<depassement[]>(requete,requestOptions);
    }

    //récupérer un dépassement
    getOneDepassement(id:number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getOneDepassement/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<depassement[]>(requete,requestOptions);
    }

    //récupérer un arrêt
    getOneArret(id:number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getOneArret/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<depassement[]>(requete,requestOptions);
    }

    //récupérer la somme des dépassements pour un mois
    getDepassementsSum(dateDebut : string, dateFin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/DepassementsSum/"+dateDebut+"/"+dateFin+"/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<sumDepassement>(requete,requestOptions);
    }

    //récupérer la somme des dépassements pour un mois et pour four 1
    getDepassementsSumFour(dateDebut : string, dateFin : string, numFour : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/DepassementsSumFour/"+dateDebut+"/"+dateFin+"/"+this.idUsine+"/"+numFour;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<sumDepassement>(requete,requestOptions);
    }

    //delete dépassements
    deleteDepassement(id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/DeleteDepassement/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }

    /**
     * ARRETS
     */

    //insérer un arrêt
    createArret(dateDebut : string, dateFin : string, duree : number, idUser : number, dateSaisie : string, description : string, productId : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/Arrets?dateDebut="+dateDebut+"&dateFin="+dateFin+"&duree="+duree+"&user="+idUser+"&dateSaisie="+dateSaisie+"&description="+description+"&productId="+productId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //modifier un arrêt
    updateArret(id : number, dateDebut : string, dateFin : string, duree : number, idUser : number, dateSaisie : string, description : string, productId : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateArret/"+id+"?dateDebut="+dateDebut+"&dateFin="+dateFin+"&duree="+duree+"&user="+idUser+"&dateSaisie="+dateSaisie+"&description="+description+"&productId="+productId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //modifier un dépassement
    updateDepassement(id : number, dateDebut : string, dateFin : string, duree : number, idUser : number, dateSaisie : string, description : string, productId : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateDepassement/"+id+"?dateDebut="+dateDebut+"&dateFin="+dateFin+"&duree="+duree+"&user="+idUser+"&dateSaisie="+dateSaisie+"&description="+description+"&productId="+productId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //récupérer l'historique des arrêts pour un mois
    getArrets(dateDebut : string, dateFin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/Arrets/"+dateDebut+"/"+dateFin+"/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<arret[]>(requete,requestOptions);
    }

    //récupérer la somme des arrêts par type pour un mois
    getArretsType(dateDebut : string, dateFin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/ArretsSumGroup/"+dateDebut+"/"+dateFin+"/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<sumArret>(requete,requestOptions);
    }

    //récupérer la somme des arrêts pour un mois
    getArretsSum(dateDebut : string, dateFin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/ArretsSum/"+dateDebut+"/"+dateFin+"/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<sumArret>(requete,requestOptions);
    }

    //récupérer la somme des arrêts pour un mois et pour 1 four
    getArretsSumFour(dateDebut : string, dateFin : string, numFour : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/ArretsSumFour/"+dateDebut+"/"+dateFin+"/"+this.idUsine+"/"+numFour;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<sumArret>(requete,requestOptions);
    }

    //delete arret
    deleteArret(id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/DeleteArret/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }

    //envoi d'un mail pour alerter
    sendEmail(dateDeb : string, heureDeb : string, duree : number, typeArret : string, commentaire : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/sendmail/"+dateDeb+"/"+heureDeb+"/"+duree+"/"+typeArret+"/"+commentaire+"/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

}
