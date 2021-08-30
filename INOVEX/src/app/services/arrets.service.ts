import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class arretsService {

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

    //insérer un arrêt
    createArret(dateDebut : string, dateFin : string, duree : number, idUser : number, dateSaisie : string, description : string, productId : number){
        //?dateDebut=dd&dateFin=dd&duree=zz&user=0&dateSaisie=zz&description=erre&productId=2
        let requete = "http://"+this.ip+":"+this.portAPI+"/Arrets?dateDebut="+dateDebut+"&dateFin="+dateFin+"&duree="+duree+"&user="+idUser+"&dateSaisie="+dateSaisie+"&description="+description+"&productId="+productId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

}
