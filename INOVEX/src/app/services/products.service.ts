import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {product} from "../../models/products.model";
import { idUsineService } from "./idUsine.service";

@Injectable()
export class productsService {

    private _nom : string;
    private _code : string;
    private _unit : string;
    private _tag : string;

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    private portAPI = 3102;
    private ip = "fr-couvinove301.prod.paprec.fr";
    //private ip = "localhost";
    private idUsine : number | undefined;

    constructor(private http: HttpClient, private idUsineService : idUsineService) {
        this.httpClient = http;
        this._nom = '';
        this._code = '';
        this._unit = '';
        this._tag = '';
        //@ts-ignore
        this.idUsine = this.idUsineService.getIdUsine();
    }

    //récupérer le dernier code
    getLastCode(Code : string, idUsine : number) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/productLastCode?Code="+Code+"&idUsine="+idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //création du produit
    createProduct(typeId : number, idUsine : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/Product?Name="+this._nom+"&Code="+this._code+"&typeId="+typeId+"&Unit="+this._unit+"&idUsine="+idUsine+"&TAG="+this._tag;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //récupérer les compteurs
    getCompteurs(Code : string, name : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/Compteurs?Code="+Code+"&name=" + name + "&idUsine="+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

     //récupérer les qse
     getQse() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/qse?idUsine="+this.idUsine;
        // console.log(requete);
        
        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
            
    }

    //récupérer les compteurs pour les arrêts
    getCompteursArrets(Code : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/CompteursArrets?Code="+Code+"&idUsine="+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les valeurs de compteur
    getValueCompteurs(Date : string, Code : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/Compteurs/"+Code+"/"+Date+"?idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //insérer une valeur de compteur
    createMeasure(Date : string, Value : number, Code : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/SaisieMensuelle?Date="+Date+"&Value="+Value+"&Code="+Code+"&idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //récupérer les analyses
    getAnalyses(Code : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/Analyses?Code="+Code+"&idUsine="+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les dépassements 1/2 heures
    getDep() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/AnalysesDep/"+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les sortants
    getSortants(Code : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/Sortants?Code="+Code+"&idUsine="+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les livraison de réactifs
    getReactifs() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/reactifs?idUsine="+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les sortants
    getSortantsAndCorrespondance(Code : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/getSortantsAndCorrespondance?Code="+Code+"&idUsine="+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les sortants
    getReactifsAndCorrespondance() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/getReactifsAndCorrespondance?idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
           .get<product[]>(requete,requestOptions);
    }

    //récupérer les consommables & autres
    getConsos() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/Consos/"+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les produits pour le PCI
    getPCI() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/pci/"+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les containers
    getProductEntrant() {
        let requete = "https://"+this.ip+":"+this.portAPI+"/productsEntrants/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les valeurs d'analyses, de sortants, de consommables
    getValueProducts(Date : string, Id : number) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/ValuesProducts/"+Id+"/"+Date;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //récupérer les produits par catégories => pour admin uniquement
    getAllProductsByType(typeId : number, name : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/Products/"+typeId+"?Name="+name+"&idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //récupérer les produits par catégories => pour admin uniquement
    getAllProductsAndElementRondier(typeId : number, name : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/ProductsAndElementRondier/"+typeId+"?Name="+name+"&idUsine="+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<product[]>(requete,requestOptions);
    }

    //mettre à jour le enabled d'un produit
    setEnabled(Id: number, enabled : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/productEnabled/"+Id+"/"+enabled;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //mettre à jour l'unité d'un produit
    setUnit(unit: string, Id: number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/productUnit/"+Id+"?Unit="+unit;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //mettre à jour le type d'un produit
    setType(type: number, Id: number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/productType/"+Id+"/"+type;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    updateTypeRecup(id : number, typeRecupEMonitoring : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateRecupEMonitoring?id="+id+"&typeRecup="+typeRecupEMonitoring;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }
    /*
    ** Partie IMAGINDATA
    */

    //récupération produits sans TAG
    getProductsWithoutTAG(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/ProductWithoutTag/"+this.idUsine;
        //console.log(requete);
  
        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };
  
        return this.http
          .get<product[]>(requete,requestOptions);
    }

    //mettre à jour le TAG ou le code GMAO d'un produit
    //?TAG=SJSJJS ou ?CodeEquipement=xxxx
    setElement(Code: string, productId: number,type : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/product"+type +"/"+productId+"?"+type +"="+Code;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }
  
    /*
    ** FIN Partie IMAGINDATA
    */


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

    get tag(): string {
        return this._tag;
    }

    set tag(tag: string) {
        this._tag = tag;
    }

}
