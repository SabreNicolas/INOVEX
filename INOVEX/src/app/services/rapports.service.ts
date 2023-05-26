import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { rapport } from "src/models/rapport.model";

@Injectable()
export class rapportsService {

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    private portAPI = 3100;
    //private ip = "fr-couvinove301.prod.paprec.fr";
    private ip = "localhost";
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

    //récupérer les rapports pour l'usine sur laquelle on se trouve
    getRapports() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/rapports/"+this.idUsine
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<rapport[]>(requete,requestOptions);
    }

}