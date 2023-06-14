import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { maintenance } from "src/models/maintenance.model";
import { site } from "src/models/site.model";
import { user } from "src/models/user.model";
import { zone } from "src/models/zone.model";

@Injectable()
export class cahierQuartService {


    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    private portAPI = 3100;
    private ip = "fr-couvinove301.prod.paprec.fr";
    //private ip = "localhost";
    private idUsine : number | undefined;
    private idUser : number | undefined;

    constructor(private http: HttpClient) {
        this.httpClient = http;

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

    //Récupérer les rondiers sans équipe
    getUsersRondierSansEquipe(){
      let requete = "https://"+this.ip+":"+this.portAPI+"/usersRondierSansEquipe?idUsine=" + this.idUsine;

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<user[]>(requete,requestOptions);
    }

    //Récupérer les zones d'une usine
    getZones(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/zones/"+this.idUsine;

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<zone[]>(requete,requestOptions);
    }

    //Créer une nouvelle équipe
    nouvelleEquipe(nomEquipe :string, quart : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/equipe?nomEquipe="+nomEquipe +"&quart="+ quart +"&idChefQuart=" + this.idUser;

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .put<any>(requete,null,requestOptions);
    }

    //Ajouter les utilisateur à une équipe
    nouvelleAffectationEquipe(idUser : number,idEquipe : number ,idZone : number ,poste : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/affectationEquipe?idRondier="+idUser +"&idEquipe="+ idEquipe+"&idZone=" + idZone +"&poste="+poste;
    
          const requestOptions = {
              headers: new HttpHeaders(this.headerDict),
          };
    
          return this.http
              .put<any>(requete,null,requestOptions);
    }

    //Récupérer les équipes d'une usine
    getEquipes(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/equipes?&idUsine="+ this.idUsine;
        //   console.log(requete);
    
    
          const requestOptions = {
              headers: new HttpHeaders(this.headerDict),
          };
    
          return this.http
              .get<any>(requete,requestOptions);
    }
    
    //Récupérer une seule équipe
    getOneEquipe(idEquipe : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getOneEquipe?&idUsine="+ this.idUsine + "&idEquipe=" + idEquipe;
        //   console.log(requete);
    
    
          const requestOptions = {
              headers: new HttpHeaders(this.headerDict),
          };
    
          return this.http
              .get<any>(requete,requestOptions);
    }

    //Mise à jour des infos d'une équipe
    udpateEquipe(nomEquipe : string, quart : number, idEquipe : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateEquipe?&nomEquipe="+ nomEquipe + "&quart=" + quart + "&idEquipe="+idEquipe;
        
          const requestOptions = {
              headers: new HttpHeaders(this.headerDict),
          };
    
          return this.http
              .put<any>(requete,null,requestOptions);
    }


    //Supprimer une une équipe
    deleteEquipe(idEquipe : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/deleteEquipe/"+idEquipe;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }

    //Supprimer les Rondiers d'une équipe
    deleteAffectationEquipe(idEquipe : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/deleteAffectationEquipe/"+idEquipe;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }
}