import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {moralEntity} from "../../models/moralEntity.model";
import {UserComponent} from "../user/user.component";
import {user} from "../../models/user.model";

@Injectable()
export class loginService {

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    }
    private portAPI = 3000;
    private ip = "192.168.172.17";

    constructor(private http: HttpClient) {
        this.httpClient = http;
    }

    //création d'utilisateur
    createUser(nom : string, prenom : string, login : string, pwd : string, isRondier : number, isSaisie : number, isQSE : number, isRapport : number, isAdmin : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/User?nom="+nom+"&prenom="+prenom+"&login="+login+"&pwd="+pwd+"&isRondier="+isRondier+"&isSaisie="+isSaisie+"&isQSE="+isQSE+"&isRapport="+isRapport+"&isAdmin="+isAdmin;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //récupérer le login pour voir si il est déjà utilisé
    getLogin(login : string) {
        let requete = "http://"+this.ip+":"+this.portAPI+"/User/"+login;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<user>(requete,requestOptions);
    }

    //récupérer l'utilisateur qui se connecte
    getUserLoged(login : string, pwd : string) {
        let requete = "http://"+this.ip+":"+this.portAPI+"/User/"+login+"/"+pwd;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<user>(requete,requestOptions);
    }

    //Mise à jour mot de pase utilisateur
    updatePwd(login : string, pwd : string){
        let requete = "http://"+this.ip+":"+this.portAPI+"/User/"+login+"/"+pwd;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }


}
