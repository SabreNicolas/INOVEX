import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { rapport } from "src/models/rapport.model";
import { idUsineService } from "./idUsine.service";

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
    private ip = "fr-couvinove301.prod.paprec.fr";
    //private ip = "localhost";
    private idUsine : number | undefined;
    
    constructor(private http: HttpClient, private idUsineService : idUsineService) {
        this.httpClient = http;
        //@ts-ignore
        this.idUsine = this.idUsineService.getIdUsine();
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

        //récupérer les rapports pour l'usine sur laquelle on se trouve
        getModeOPs() {
            let requete = "https://"+this.ip+":"+this.portAPI+"/rapports/5"
            //console.log(requete);
    
    
            const requestOptions = {
                headers: new HttpHeaders(this.headerDict),
            };
    
            return this.http
                .get<rapport[]>(requete,requestOptions);
        }

}