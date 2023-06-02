import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { maintenance } from "src/models/maintenance.model";
import { site } from "src/models/site.model";
import { user } from "src/models/user.model";
import { zone } from "src/models/zone.model";

@Injectable()
export class cahierQuartService {

    private _nom : string;
    private _code : string;
    private _parentId : number;
    public sites : site[];

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
    private idUser : number | undefined;

    constructor(private http: HttpClient) {
        this.httpClient = http;
        this._nom = '';
        this._code = '';
        this._parentId = 0;
        this.sites = [];
        //Récupération du user dans localStorage
        var userLogged = localStorage.getItem('user');
        if (typeof userLogged === "string") {
            var userLoggedParse = JSON.parse(userLogged);

            //Récupération de l'idUsine
            // @ts-ignore
            this.idUsine = userLoggedParse['idUsine'];
            // @ts-ignore
            this.idUser = userLoggedParse['Id'];
        }
    }

    getUsersRondier(){
      let requete = "https://"+this.ip+":"+this.portAPI+"/UsersRondier?idUsine=1";
      console.log(requete);


      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<user[]>(requete,requestOptions);
    }

    getZones(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/zones/"+this.idUsine;
    //   console.log(requete);


      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<zone[]>(requete,requestOptions);
    }
    nouvelleEquipe(nomEquipe :string, quart : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/equipe?nomEquipe="+nomEquipe +"&quart="+ quart +"&idChefQuart=" + this.idUser;
    //   console.log(requete);


      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .put<any>(requete,null,requestOptions);
    }

    nouvelleAffectationEquipe(idUser : number,idEquipe : number ,idZone : number ,poste : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/affectationEquipe?idRondier="+idUser +"&idEquipe="+ idEquipe+"&idZone=" + idZone +"&poste="+poste;
        //   console.log(requete);
    
    
          const requestOptions = {
              headers: new HttpHeaders(this.headerDict),
          };
    
          return this.http
              .put<any>(requete,null,requestOptions);
    }
    
}