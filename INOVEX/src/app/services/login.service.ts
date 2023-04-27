import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {user} from "../../models/user.model";

@Injectable()
export class loginService {

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    }
    private portAPI = 3100;
    private ip = "fr-couvinove301.prod.paprec.fr";
    // private ip = "localhost";
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

    //création d'utilisateur
    createUser(nom : string, prenom : string, login : string, pwd : string, isRondier : number, isSaisie : number, isQSE : number, isRapport : number, isChefQuart : number, isAdmin : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/User?nom="+nom+"&prenom="+prenom+"&login="+login+"&pwd="+pwd+"&isRondier="+isRondier+"&isSaisie="+isSaisie+"&isQSE="+isQSE+"&isRapport="+isRapport+"&isChefQuart="+isChefQuart+"&isAdmin="+isAdmin+"&idUsine="+this.idUsine;
        console.log(requete);
        
        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //récupérer la list des utilisateurs
    getAllUsers(loginLike : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/Users?login="+loginLike+"&idUsine="+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<user[]>(requete,requestOptions);
    }

    //récupérer le login pour voir si il est déjà utilisé
    getLogin(login : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/User/"+login;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<user>(requete,requestOptions);
    }

    //récupérer l'utilisateur qui se connecte
    getUserLoged(login : string, pwd : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/User/"+login+"/"+pwd;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<user>(requete,requestOptions);
    }

    //Mise à jour mot de pase utilisateur
    updatePwd(login : string, pwd : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/User/"+login+"/"+pwd;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //Mise à jour des droits rondier ou saisie ou qse ou rapports ou chef de quart ou admin
    updateDroit(login : string, droit : number, choix : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/"+choix+"/"+login+"/"+droit;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //delete user
    deleteUser(id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/user/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }


}
