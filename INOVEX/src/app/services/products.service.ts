import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class productsService {

    private _nom : string;
    private _code : string;
    private _unit : string;

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
        this._nom = '';
        this._code = '';
        this._unit = '';
    }

    //récupérer le dernier code
    getLastCode(Code : string) {
        let requete = "http://"+this.ip+":"+this.portAPI+"/productLastCode?Code="+Code;
        console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //création du produit de type compteur
    createProduct(){
        let requete = "http://"+this.ip+":"+this.portAPI+"/Product?Name="+this._nom+"&Code="+this._code+"&typeId=4&Unit="+this._unit;
        console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //récupérer les categories
    getCategories() {
        let requete = "http://"+this.ip+":"+this.portAPI+"/Categories";
        console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any[]>(requete,requestOptions);
    }


    //GETTER & SETTER
    get nom(): string {
        return this._nom;
    }

    set nom(value: string) {
        this._nom = value;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get unit(): string {
        return this._unit;
    }

    set unit(value: string) {
        this._unit = value;
    }
}
