import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { maintenance } from "src/models/maintenance.model";
import { site } from "src/models/site.model";
import { user } from "src/models/user.model";
import { zone } from "src/models/zone.model";
import { idUsineService } from "./idUsine.service";

@Injectable()
export class cahierQuartService {


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

    constructor(private http: HttpClient, private idUsineService : idUsineService) {
        this.httpClient = http;
        this.idUsine = this.idUsineService.getIdUsine();
        this.idUser = this.idUsineService.getIdUser();
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
           //console.log(requete);
    
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
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateEquipe?&nomEquipe="+ nomEquipe + "&quart=" + quart + "&idEquipe="+idEquipe  +"&idChefQuart=" + this.idUser;
        
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


     //Récupérer une actualité
     getOneConsigne(idConsigne : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getOneConsigne?idConsigne="+idConsigne;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    /****Actualités *******/

    //Créer une nouvelle actualité
    newActu(titre:string, importance:number, dateDeb:string, dateFin:string){
        titre = encodeURIComponent(titre);
        console.log(dateDeb)
        let requete = "https://"+this.ip+":"+this.portAPI+"/actu?titre="+titre+"&importance="+importance+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&idUsine="+this.idUsine;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
          .put<any>(requete,null,requestOptions);
    }

    //Modifier une actualité
    updateActu(titre:string, importance:number, dateDeb:string, dateFin:string, idActu : number){
        titre = encodeURIComponent(titre);
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateActu?titre="+titre+"&importance="+importance+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&idActu="+idActu;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
          .put<any>(requete,null,requestOptions);
    }

    //Récupérer une actualité
    getOneActu(idActu : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getOneActu?idActu="+idActu;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Récupérer toutes actualité
    getAllActu(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getAllActu?idUsine="+this.idUsine;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Modifier une actualité
    validerActu(idActu : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/validerActu?idActu="+idActu;

        const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
        };

        return this.http
        .put<any>(requete,null,requestOptions);
    }

    //Modifier une actualité
    invaliderActu(idActu : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/invaliderActu?idActu="+idActu;

        const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
        };

        return this.http
        .put<any>(requete,null,requestOptions);
    }


        /****Evenement *******/

    //Créer un nouvel évènement
    newEvenement(titre:string,fileToUpload:File, importance:number, dateDeb:string, dateFin:string, groupementGMAO:string, equipementGMAO : string, cause : string, description:string, consigne : number, demandeTravaux : number){
        titre = encodeURIComponent(titre);
        groupementGMAO = encodeURIComponent(groupementGMAO);
        equipementGMAO = encodeURIComponent(equipementGMAO);
        cause = encodeURIComponent(cause);
        description = encodeURIComponent(description);
        //utilisation de formData pour conserver le format du fichier
        const formData = new FormData();
        // @ts-ignore
        formData.append('fichier', fileToUpload, fileToUpload.name);
        let requete = "https://"+this.ip+":"+this.portAPI+"/evenement?titre="+titre+"&importance="+importance+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&idUsine="+this.idUsine+"&groupementGMAO="+groupementGMAO+"&equipementGMAO="+equipementGMAO+"&cause="+cause+"&description="+description+"&consigne="+consigne+"&demandeTravaux="+demandeTravaux;
        const headers = new HttpHeaders();
        // @ts-ignore
        headers.append('Content-Type', null);
        headers.append('Accept', 'application/json');
        const requestOptions = {
          headers: headers,
        };

        return this.http
          .put<any>(requete,formData,requestOptions);
    }

    //Modifier un évènement
    updateEvenement(titre:string, importance:number, dateDeb:string, dateFin:string, groupementGMAO:string, equipementGMAO : string, cause : string, description:string, consigne : number, demandeTravaux : number, idEvenement:number){
        titre = encodeURIComponent(titre);
        groupementGMAO = encodeURIComponent(groupementGMAO);
        equipementGMAO = encodeURIComponent(equipementGMAO);
        cause = encodeURIComponent(cause);
        description = encodeURIComponent(description);
        
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateEvenement?titre="+titre+"&importance="+importance+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&idEvenement="+idEvenement+"&groupementGMAO="+groupementGMAO+"&equipementGMAO="+equipementGMAO+"&cause="+cause+"&description="+description+"&consigne="+consigne+"&demandeTravaux="+demandeTravaux;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
          .put<any>(requete,null,requestOptions);
    }
   

    //Récupérer une actualité
    getOneEvenement(idEvenement : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getOneEvenement?idEvenement="+idEvenement;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Récupérer toutes actualité
    getAllEvenement(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getAllEvenement?idUsine="+this.idUsine;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Supprimer une une équipe
    deleteEvenement(id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/deleteEvenement/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }
}