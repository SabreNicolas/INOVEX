import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { idUsineService } from "./idUsine.service";
import { formulaire } from "src/models/formulaire.model";

@Injectable()
export class formulaireService {

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    private portAPI = 3100;
    //private ip = "fr-couvinove301.prod.paprec.fr";
    private ip = "127.0.0.1";
    private idUsine : number | undefined;

    constructor(private http: HttpClient, private idUsineService : idUsineService) {
        this.httpClient = http;
        //@ts-ignore
        this.idUsine = this.idUsineService.getIdUsine();
    }


    //création de formulaire
    createFormulaire(nom : string, type : string){
        nom = encodeURIComponent(nom);
        let requete = "https://"+this.ip+":"+this.portAPI+"/formulaire?nom="+nom+"&type="+type+"&idUsine="+this.idUsine;
        //console.log(requete);
  
        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };
  
        return this.http
          .put<any>(requete,null,requestOptions);
    }

    //récupérer les formulaires d'un site
    getFormulaire() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/formulaires?idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<formulaire[]>(requete,requestOptions);
    }

}