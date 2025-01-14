import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class tokenApiService {
    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    private portAPI = 3100;
   // private ip = "fr-couvinove301.prod.paprec.fr";
    private ip = "localhost";

    constructor(private http: HttpClient) {
        this.httpClient = http;
        //Récupération du user dans localStorage
        var userLogged = localStorage.getItem('user');
        if (typeof userLogged === "string") {
            var userLoggedParse = JSON.parse(userLogged);
        }
    }
    //Génération de token d'accès pour swagger
    generateAcessToken(saisie : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/accesToken?affectation=" + saisie;
        

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }
    //Fonction permettant de récupérer tout les token actifs de l'api
    getAllTokens(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/allAccesTokens";
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }
    //Fonction permettant de désactiver un token
    desactivateToken(id: number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/desactivateToken?id="+id;

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }
    //Fonction permettant de modifier l'affectation d'un token
    updateToken(id : number, saisie : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateToken?affectation=" + saisie + "&id=" + id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }
}