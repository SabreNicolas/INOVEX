import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { dechetsCollecteurs } from "src/models/dechetsCollecteurs.model";
import { valueHodja } from "src/models/valueHodja.model";
import {moralEntity} from "../../models/moralEntity.model";

@Injectable()
export class moralEntitiesService {

    private _nom : string;
    private _adress : string;
    private _code : string;
    private _unitPrice : number;
    private _numCAP : string;
    private _codeDechet : string;
    private _nomClient : string;
    private _prenomClient : string;
    private _mailClient : string;
    private _MR : moralEntity | undefined;

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    }
    private portAPI = 3100;
    private portAPIHodja = 3101;
    // private ip = "fr-couvinove301.prod.paprec.fr";
    private ip = "localhost";
    private idUsine : number | undefined;

    constructor(private http: HttpClient) {
        this.httpClient = http;
        this._nom = '';
        this._adress = '';
        this._code = '';
        this._unitPrice = 0.0;
        this._numCAP = '';
        this._codeDechet = '';
        this._nomClient = '';
        this._prenomClient = '';
        this._mailClient = '';
        //Récupération du user dans localStorage
        var userLogged = localStorage.getItem('user');
        if (typeof userLogged === "string") {
            var userLoggedParse = JSON.parse(userLogged);

            //Récupération de l'idUsine
            // @ts-ignore
            this.idUsine = userLoggedParse['idUsine'];
        }
    }

    //création de client
    createMoralEntity(){
      let requete = "https://"+this.ip+":"+this.portAPI+"/moralEntitie?Name="+this._nom+"&Address="+this._adress+"&Code="+this._code+"&UnitPrice="+this._unitPrice+"&numCAP="+this.numCAP+"&codeDechet="+this.codeDechet+"&nomClient="+this.nomClient+"&prenomClient="+this.prenomClient+"&mailClient="+this.mailClient+"&idUsine="+this.idUsine;
      //console.log(requete);

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .put<any>(requete,requestOptions);
    }

    //récupérer le dernier code
    getLastCode(Code : string) {
      let requete = "https://"+this.ip+":"+this.portAPI+"/moralEntitieLastCode?Code="+Code+"&idUsine="+this.idUsine;
      //console.log(requete);


      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .get<any>(requete,requestOptions);
    }

    //récupérer les clients avec Enabled à 1 (pour la saisie)
    getMoralEntities(Code : string) {
      let requete = "https://"+this.ip+":"+this.portAPI+"/moralEntities?Code="+Code+"&idUsine="+this.idUsine;
      //console.log(requete);


      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .get<moralEntity[]>(requete,requestOptions);
    }

    //récupérer les clients
    getMoralEntitiesAll(Code : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/moralEntitiesAll?Code="+Code+"&idUsine="+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<moralEntity[]>(requete,requestOptions);
    }

    //récupérer 1 client
    getOneMoralEntity(Id : number) {
      let requete = "https://"+this.ip+":"+this.portAPI+"/moralEntitie/"+Id;
      //console.log(requete);


      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<moralEntity>(requete,requestOptions);
    }

    //mettre à jour le code d'un client
    setCode(Code: string | null, Id: number){
      let requete = "https://"+this.ip+":"+this.portAPI+"/moralEntitieCode/"+Id+"?Code="+Code;
      //console.log(requete);

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .put<any>(requete,requestOptions);
    }

    //mettre à jour le prix d'un client
    setPrix(prix: string, Id: number){
      let requete = "https://"+this.ip+":"+this.portAPI+"/moralEntitieUnitPrice/"+Id+"?UnitPrice="+prix;
      //console.log(requete);

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .put<any>(requete,requestOptions);
    }

    //mettre à jour le num de CAP d'un client
    setCAP(cap: string, Id: number){
      let requete = "https://"+this.ip+":"+this.portAPI+"/moralEntitieCAP/"+Id+"?cap="+cap;
      //console.log(requete);

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .put<any>(requete,requestOptions);
    }

    //mettre à jour le nom d'un client
    setName(name: string, Id: number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/moralEntitieName/"+Id+"?Name="+name;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //mettre à jour le enabled d'un client
    setEnabled(Id: number, Enabled : number){
      let requete = "https://"+this.ip+":"+this.portAPI+"/moralEntitieEnabled/"+Id+"/"+Enabled;
      //console.log(requete);

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .put<any>(requete,requestOptions);
    }

    //update de client
    updateMoralEntity(Id : number){
      let requete = "https://"+this.ip+":"+this.portAPI+"/moralEntitieAll/"+Id+"?Name="+this._nom+"&Address="+this._adress+"&Code="+this._code+"&UnitPrice="+this._unitPrice+"&numCAP="+this.numCAP+"&codeDechet="+this.codeDechet+"&nomClient="+this.nomClient+"&prenomClient="+this.prenomClient+"&mailClient="+this.mailClient;
      //console.log(requete);

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .put<any>(requete,requestOptions);
    }

    //insérer une mesure
    createMeasure(EntryDate : string, Value : number, ProductId : number, ProducerId : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/Measure?EntryDate="+EntryDate+"&Value="+Value+"&ProductId="+ProductId+"&ProducerId="+ProducerId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //récupérer les tonnages ou valeurs qse
    getEntry(EntryDate : string, ProductId : number, ProducerId : number) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/Entrant/"+ProductId+"/"+ProducerId+"/"+EntryDate;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }


    //récupérer la somme des tonnages
    getTotal(EntryDate : string, dechet : string) {
        let requete = "https://"+this.ip+":"+this.portAPI+"/TotalMeasures/"+dechet+"/"+EntryDate+"/"+this.idUsine;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //** PARTIE Products mais est directement lié aux MR donc se trouve ici */
    //récupérer les types de déchets et collecteurs
    GetTypeDéchets() {
      let requete = "https://"+this.ip+":"+this.portAPI+"/DechetsCollecteurs/"+this.idUsine;
      //console.log(requete);

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<dechetsCollecteurs[]>(requete,requestOptions);
    }

    //Récupération type d'import des pesées
    GetImportTonnage() {
      let requete = "https://"+this.ip+":"+this.portAPI+"/typeImport/"+this.idUsine;
      //console.log(requete);

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<string>(requete,requestOptions);
    }

    /*
    ** Partie HODJA
    */

    //récupération HODJA
    recupHodja(dateDeb : string, dateFin : string){
      let requete = "https://"+this.ip+":"+this.portAPIHodja+"/entrants?dateDeb="+dateDeb+"&dateFin="+dateFin;
      console.log(requete);

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .get<valueHodja[]>(requete,requestOptions);
    }


    /*
    ** FIN Partie HODJA
    */



    //GETTER & SETTER
    get nom(): string {
      return this._nom;
    }

    set nom(value: string) {
      this._nom = value;
    }

    get adress(): string {
      return this._adress;
    }

    set adress(value: string) {
      this._adress = value;
    }

    get code(): string {
      return this._code;
    }

    set code(value: string) {
      this._code = value;
    }

    get unitPrice(): number {
      return this._unitPrice;
    }

    set unitPrice(value: number) {
      this._unitPrice = value;
    }

    get numCAP(): string {
      return this._numCAP;
    }

    set numCAP(value: string) {
        this._numCAP = value;
    }

    get codeDechet(): string {
        return this._codeDechet;
    }

    set codeDechet(value: string) {
        this._codeDechet = value;
    }

    get nomClient(): string {
        return this._nomClient;
    }

    set nomClient(value: string) {
        this._nomClient = value;
    }

    get prenomClient(): string {
        return this._prenomClient;
    }

    set prenomClient(value: string) {
        this._prenomClient = value;
    }

    get mailClient(): string {
        return this._mailClient;
    }

    set mailClient(value: string) {
        this._mailClient = value;
    }


    get MR(): moralEntity {
        return <moralEntity>this._MR;
    }

    set MR(value: moralEntity) {
        this._MR = value;
    }
}
