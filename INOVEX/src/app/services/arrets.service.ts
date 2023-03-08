import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {arret} from "../../models/arrets.model";
import {sumArret} from "../../models/sumArret.model";
import {depassement} from "../../models/depassement.model";
import {sumDepassement} from "../../models/sumDepassement.model";

@Injectable()
export class arretsService {

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    }
    private portAPI = 3100;
    private ip = "fr-couvinove301.prod.paprec.fr";
    private idUsine : number | undefined;

    constructor(private http: HttpClient) {
        this.httpClient = http;
        //Récupération du user dans localStorage
        var userLogged = localStorage.getItem('user');
        if (typeof userLogged === "string") {
            var userLoggedParse = JSON.parse(userLogged);

            //Récupération de l'idUsine
            // @ts-ignore
            this.idUsine = userLoggedParse['idUsine'];
        }
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
            .put<any>(requete,requestOptions);
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

    //récupérer la somme des dépassements pour un mois et pour 1
    getDepassementsSum1(dateDebut : string, dateFin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/DepassementsSum1/"+dateDebut+"/"+dateFin+"/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<sumDepassement>(requete,requestOptions);
    }

    //récupérer la somme des dépassements pour un mois et pour 2
    getDepassementsSum2(dateDebut : string, dateFin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/DepassementsSum2/"+dateDebut+"/"+dateFin+"/"+this.idUsine;
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
            .put<any>(requete,requestOptions);
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

    //récupérer la somme des arrêts pour un mois et pour 1
    getArretsSum1(dateDebut : string, dateFin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/ArretsSum1/"+dateDebut+"/"+dateFin+"/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<sumArret>(requete,requestOptions);
    }

    //récupérer la somme des arrêts pour un mois et pour 2
    getArretsSum2(dateDebut : string, dateFin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/ArretsSum2/"+dateDebut+"/"+dateFin+"/"+this.idUsine;
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
