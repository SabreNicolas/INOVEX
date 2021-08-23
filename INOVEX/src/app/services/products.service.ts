import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {product} from "../../models/products.model";

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
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //création du produit de type compteur
    createProduct(){
        let requete = "http://"+this.ip+":"+this.portAPI+"/Product?Name="+this._nom+"&Code="+this._code+"&typeId=4&Unit="+this._unit;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //récupérer les compteurs
    getCompteurs(Code : string) {
        let requete = "http://"+this.ip+":"+this.portAPI+"/Compteurs?Code="+Code;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les valeurs de compteur
    getValueCompteurs(Date : string, Code : string) {
        let requete = "http://"+this.ip+":"+this.portAPI+"/Compteurs/"+Code+"/"+Date;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //insérer une valeur de compteur
    createMeasure(Date : string, Value : number, Code : string){
        let requete = "http://"+this.ip+":"+this.portAPI+"/SaisieMensuelle?Date="+Date+"&Value="+Value+"&Code="+Code;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //récupérer les analyses
    getAnalyses(Code : string) {
        let requete = "http://"+this.ip+":"+this.portAPI+"/Analyses?Code="+Code;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les sortants
    getSortants(Code : string) {
        let requete = "http://"+this.ip+":"+this.portAPI+"/Sortants?Code="+Code;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les consommables & autres
    getConsos() {
        let requete = "http://"+this.ip+":"+this.portAPI+"/Consos";
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les valeurs d'analyses, de sortants, de consommables
    getValueProducts(Date : string, Id : number) {
        let requete = "http://"+this.ip+":"+this.portAPI+"/ValuesProducts/"+Id+"/"+Date;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
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