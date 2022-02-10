import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {zone} from "../../models/zone.model";

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


    /*
    FIN ELEMENT DE CONTROLE
     */
}