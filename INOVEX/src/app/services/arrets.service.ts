import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {arret} from "../../models/arrets.model";
import {sumArret} from "../../models/sumArret.model";

@Injectable()
export class arretsService {

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    }
    private portAPI = 3000;
    private ip = "127.0.0.1";

    constructor(private http: HttpClient) {
        this.httpClient = http;
    }

    //insérer un arrêt
    createArret(dateDebut : string, dateFin : string, duree : number, idUser : number, dateSaisie : string, description : string, productId : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/Arrets?dateDebut="+dateDebut+"&dateFin="+dateFin+"&duree="+duree+"&user="+idUser+"&dateSaisie="+dateSaisie+"&description="+description+"&productId="+productId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //récupérer l'historique des arrêts pour un mois
    getArrets(dateDebut : string, dateFin : string){
        let requete = "http://"+this.ip+":"+this.portAPI+"/Arrets/"+dateDebut+"/"+dateFin;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<arret>(requete,requestOptions);
    }

    //récupérer la somme des arrêts par type pour un mois
    getArretsType(dateDebut : string, dateFin : string){
        let requete = "http://"+this.ip+":"+this.portAPI+"/ArretsSumGroup/"+dateDebut+"/"+dateFin;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<sumArret>(requete,requestOptions);
    }

    //récupérer la somme des arrêts pour un mois
    getArretsSum(dateDebut : string, dateFin : string){
        let requete = "http://"+this.ip+":"+this.portAPI+"/ArretsSum/"+dateDebut+"/"+dateFin;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<sumArret>(requete,requestOptions);
    }

    //récupérer la somme des arrêts pour un mois et pour 1
    getArretsSum1(dateDebut : string, dateFin : string){
        let requete = "http://"+this.ip+":"+this.portAPI+"/ArretsSum1/"+dateDebut+"/"+dateFin;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<sumArret>(requete,requestOptions);
    }

    //récupérer la somme des arrêts pour un mois et pour 2
    getArretsSum2(dateDebut : string, dateFin : string){
        let requete = "http://"+this.ip+":"+this.portAPI+"/ArretsSum2/"+dateDebut+"/"+dateFin;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<sumArret>(requete,requestOptions);
    }

    //delete arret
    deleteArret(id : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/DeleteArret/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }

    //envoi d'un mail pour alerter
    sendEmail(dateDeb : string, heureDeb : string, duree : number, typeArret : string, commentaire : string){
        let requete = "http://"+this.ip+":"+this.portAPI+"/sendmail/"+dateDeb+"/"+heureDeb+"/"+duree+"/"+typeArret+"/"+commentaire;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

}
