import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

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


}
