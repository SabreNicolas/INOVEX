import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { maintenance } from "src/models/maintenance.model";
import { site } from "src/models/site.model";
import {category} from "../../models/categories.model";

@Injectable()
export class categoriesService {

    private _nom : string;
    private _code : string;
    private _parentId : number;
    private idUsine : number | undefined;

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    }
    private portAPI = 3100;
    private ip = "fr-couvinove301.prod.paprec.fr";

    constructor(private http: HttpClient) {
        this.httpClient = http;
        this._nom = '';
        this._code = '';
        this._parentId = 0;
        //Récupération du user dans localStorage
        var userLogged = localStorage.getItem('user');
        if (typeof userLogged === "string") {
            var userLoggedParse = JSON.parse(userLogged);

            //Récupération de l'idUsine
            // @ts-ignore
            this.idUsine = userLoggedParse['idUsine'];
        }
    }

    //création de catégorie
    createCategory(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/Category?Name="+this._nom+"&Code="+this._code+"&ParentId="+this._parentId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //récupérer les categories de compteurs
    getCategories() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/CategoriesCompteurs";
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<category[]>(requete,requestOptions);
    }

    //récupérer les categories d'analyses
    getCategoriesAnalyses() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/CategoriesAnalyses";
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<category[]>(requete,requestOptions);
    }

    //récupérer les categories de sortants
    getCategoriesSortants() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/CategoriesSortants";
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<category[]>(requete,requestOptions);
    }

    /*
    ***** PARTIE CHOIX SITE POUR SUPER ADMIN
    */

    //récupérer les différents sites
    getSites() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/sites";
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<site[]>(requete,requestOptions);
    }

    /*
    ***** PARTIE MAINTENANCE
    */

    //récupérer la maintenance prévue
    getMaintenance() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/Maintenance";
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<maintenance>(requete,requestOptions);
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

    get parentId(): number {
        return this._parentId;
    }

    set parentId(value: number) {
        this._parentId = value;
    }
}
