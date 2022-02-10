import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

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
}