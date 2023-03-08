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
    createUser(nom : string, prenom : string, login : string, pwd : string, isRondier : number, isSaisie : number, isQSE : number, isRapport : number, isAdmin : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/User?nom="+nom+"&prenom="+prenom+"&login="+login+"&pwd="+pwd+"&isRondier="+isRondier+"&isSaisie="+isSaisie+"&isQSE="+isQSE+"&isRapport="+isRapport+"&isAdmin="+isAdmin+"&idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //récupérer la list des utilisateurs
    getAllUsers(loginLike : string) {
        let requete = "http://"+this.ip+":"+this.portAPI+"/Users?login="+loginLike+"&idUsine="+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<user[]>(requete,requestOptions);
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

    //Mise à jour droit rondier
    updateRondier(login : string, droit : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/UserRondier/"+login+"/"+droit;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //Mise à jour droit saisie
    updateSaisie(login : string, droit : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/UserSaisie/"+login+"/"+droit;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //Mise à jour droit qse
    updateQSE(login : string, droit : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/UserQSE/"+login+"/"+droit;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    ///Mise à jour droit rapport
    updateRapport(login : string, droit : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/UserRapport/"+login+"/"+droit;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //Mise à jour droit admin
    updateAdmin(login : string, droit : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/UserAdmin/"+login+"/"+droit;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //delete user
    deleteUser(id : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/user/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }


}
