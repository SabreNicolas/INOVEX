import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { dechetsCollecteurs } from "src/models/dechetsCollecteurs.model";
import {moralEntity} from "../../models/moralEntity.model";

@Injectable()
export class moralEntitiesService {

    private _nom : string;
    private _adress : string;
    private _code : string;
    private _unitPrice : number;

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    }
    private portAPI = 3100;
    private ip = "10.255.11.5";
    private idUsine : number | undefined;

    constructor(private http: HttpClient) {
        this.httpClient = http;
        this._nom = '';
        this._adress = '';
        this._code = '';
        this._unitPrice = 0.0;
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
      let requete = "http://"+this.ip+":"+this.portAPI+"/moralEntitie?Name="+this._nom+"&Address="+this._adress+"&Code="+this._code+"&UnitPrice="+this._unitPrice+"&idUsine="+this.idUsine;
      //console.log(requete);

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .put<any>(requete,requestOptions);
    }

    //récupérer le dernier code
    getLastCode(Code : string) {
      let requete = "http://"+this.ip+":"+this.portAPI+"/moralEntitieLastCode?Code="+Code+"&idUsine="+this.idUsine;
      //console.log(requete);


      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .get<any>(requete,requestOptions);
    }

    //récupérer les clients avec Enabled à 1 (pour la saisie)
    getMoralEntities(Code : string) {
      let requete = "http://"+this.ip+":"+this.portAPI+"/moralEntities?Code="+Code+"&idUsine="+this.idUsine;
      //console.log(requete);


      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .get<moralEntity[]>(requete,requestOptions);
    }

    //récupérer les clients
    getMoralEntitiesAll(Code : string) {
        let requete = "http://"+this.ip+":"+this.portAPI+"/moralEntitiesAll?Code="+Code+"&idUsine="+this.idUsine;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<moralEntity[]>(requete,requestOptions);
    }

    //mettre à jour le code d'un client
    setCode(Code: string | null, Id: number){
      let requete = "http://"+this.ip+":"+this.portAPI+"/moralEntitieCode/"+Id+"?Code="+Code;
      //console.log(requete);

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .put<any>(requete,requestOptions);
    }

    //mettre à jour le prix d'un client
    setPrix(prix: string, Id: number){
      let requete = "http://"+this.ip+":"+this.portAPI+"/moralEntitieUnitPrice/"+Id+"?UnitPrice="+prix;
      //console.log(requete);

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .put<any>(requete,requestOptions);
    }

    //mettre à jour le nom d'un client
    setName(name: string, Id: number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/moralEntitieName/"+Id+"?Name="+name;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //mettre à jour le enabled d'un client
    setEnabled(Id: number, Enabled : number){
      let requete = "http://"+this.ip+":"+this.portAPI+"/moralEntitieEnabled/"+Id+"/"+Enabled;
      //console.log(requete);

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .put<any>(requete,requestOptions);
    }

    //insérer une mesure
    createMeasure(EntryDate : string, Value : number, ProductId : number, ProducerId : number){
        let requete = "http://"+this.ip+":"+this.portAPI+"/Measure?EntryDate="+EntryDate+"&Value="+Value+"&ProductId="+ProductId+"&ProducerId="+ProducerId;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,requestOptions);
    }

    //récupérer les tonnages ou valeurs qse
    getEntry(EntryDate : string, ProductId : number, ProducerId : number) {
        let requete = "http://"+this.ip+":"+this.portAPI+"/Entrant/"+ProductId+"/"+ProducerId+"/"+EntryDate;
        //console.log(requete);


        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }


    //récupérer la somme des tonnages
    getTotal(EntryDate : string, dechet : string) {
        let requete = "http://"+this.ip+":"+this.portAPI+"/TotalMeasures/"+dechet+"/"+EntryDate+"/"+this.idUsine;
        console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //** PARTIE Products mais est directement lié aux MR donc se trouve ici */
    //récupérer les types de déchets et collecteurs
    GetTypeDéchets() {
      let requete = "http://"+this.ip+":"+this.portAPI+"/DechetsCollecteurs/"+this.idUsine;
      console.log(requete);

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<dechetsCollecteurs[]>(requete,requestOptions);
  }



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
}
