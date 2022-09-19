import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {category} from "../../models/categories.model";

@Injectable()
export class categoriesService {

    private _nom : string;
    private _code : string;
    private _parentId : number;

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    }
    private portAPI = 3000;
    private ip = "10.255.11.5";

    constructor(private http: HttpClient) {
        this.httpClient = http;
        this._nom = '';
        this._code = '';
        this._parentId = 0;
    }

    //création de catégorie
    createCategory(){
        let requete = "http://"+this.ip+":"+this.portAPI+"/Category?Name="+this._nom+"&Code="+this._code+"&ParentId="+this._parentId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //récupérer les categories de compteurs
    getCategories() {
        let requete = "http://"+this.ip+":"+this.portAPI+"/CategoriesCompteurs";
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<category[]>(requete,requestOptions);
    }

    //récupérer les categories d'analyses
    getCategoriesAnalyses() {
        let requete = "http://"+this.ip+":"+this.portAPI+"/CategoriesAnalyses";
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<category[]>(requete,requestOptions);
    }

    //récupérer les categories de sortants
    getCategoriesSortants() {
        let requete = "http://"+this.ip+":"+this.portAPI+"/CategoriesSortants";
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<category[]>(requete,requestOptions);
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
