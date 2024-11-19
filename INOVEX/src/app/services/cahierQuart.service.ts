import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { maintenance } from "src/models/maintenance.model";
import { site } from "src/models/site.model";
import { user } from "src/models/user.model";
import { zone } from "src/models/zone.model";
import { idUsineService } from "./idUsine.service";
import {DatePipe, Location} from "@angular/common";

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

    constructor(private http: HttpClient, private idUsineService : idUsineService,private datePipe : DatePipe) {
        this.httpClient = http;
        this.idUsine = this.idUsineService.getIdUsine();
        this.idUser = this.idUsineService.getIdUser();
    }

    //Récupérer une localisation du site
    getOneLocalisation(){
      let requete = "https://"+this.ip+":"+this.portAPI+"/getOneLocalisation/" + this.idUsine;

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<user[]>(requete,requestOptions);
    }

    //Récupérer les anmoalies d'une ronde
    getAnomaliesOfOneRonde(date : string, quart : number){
      let requete = "https://"+this.ip+":"+this.portAPI+"/getAnomaliesOfOneRonde?date="+date+"&quart="+quart+"&idUsine="+this.idUsine;

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<user[]>(requete,requestOptions);
    }

    //Récupérer les rondiers sans équipe
    getOneUser(){
      let requete = "https://"+this.ip+":"+this.portAPI+"/getOneUser/" + this.idUser;

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<user[]>(requete,requestOptions);
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

    //Récupérer les rondiers sans équipe
    getUsersRondier(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/UsersRondier?idUsine=" + this.idUsine;
  
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

    /////Equipes////

    //Créer une nouvelle équipe
    nouvelleEquipe(nomEquipe :string, quart : number, date : string){
        date = encodeURIComponent(date)
        let requete = "https://"+this.ip+":"+this.portAPI+"/equipe?nomEquipe="+nomEquipe +"&quart="+ quart +"&idChefQuart=" + this.idUser+"&date="+date;

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .put<any>(requete,null,requestOptions);
    }

    //Créer une nouvel enregistrement d'équipe
    nouvelEnregistrementEquipe(nomEquipe :string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/enregistrementEquipe?nomEquipe="+nomEquipe;

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .put<any>(requete,null,requestOptions);
    }

    //Ajouter les utilisateur à une équipe
    nouvelleAffectationEquipe(idUser : number,idEquipe : number ,idZone : number ,poste : string, heure_deb : string, heure_fin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/affectationEquipe?idRondier="+idUser +"&idEquipe="+ idEquipe+"&idZone=" + idZone +"&poste="+poste+"&heure_deb="+heure_deb+"&heure_fin="+heure_fin;
    
          const requestOptions = {
              headers: new HttpHeaders(this.headerDict),
          };
    
          return this.http
              .put<any>(requete,null,requestOptions);
    }

    //modifier les heures de quart pour les utilisateurs d'une équipe
    updateInfosAffectationEquipe(idUser : number, idEquipe : number, typeInfo : string, valueInfo : string){
      valueInfo = valueInfo.replace("'","''");
      let requete = "https://"+this.ip+":"+this.portAPI+"/UpdateInfosAffectationEquipe?idRondier="+idUser +"&idEquipe="+ idEquipe+"&typeInfo="+typeInfo+"&valueInfo="+valueInfo;
  
        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };
  
        return this.http
            .put<any>(requete,null,requestOptions);
  }

    //Ajouter les utilisateur à un enregistrement équipe
    nouvelEnregistrementAffectationEquipe(idUser : number,idEquipe : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/enregistrementAffectationEquipe?idRondier="+idUser +"&idEquipe="+ idEquipe;
    
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
    
    //Récupérer les équipes enregistrées d'une usine
    getEquipesEnregistrees(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getEquipesEnregistrees?&idUsine="+ this.idUsine;
           //console.log(requete);
    
          const requestOptions = {
              headers: new HttpHeaders(this.headerDict),
          };
    
          return this.http
              .get<any>(requete,requestOptions);
    }

    //Récupérer les noms des équipes enregistrées d'une usine
    getNomsEquipesEnregistrees(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getNomsEquipesEnregistrees?&idUsine="+ this.idUsine;
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

    //Récupérer une seule équipe enregistrée
    getOneEnregistrementEquipe(idEquipe : any){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getOneEnregistrementEquipe?&idUsine="+ this.idUsine + "&idEquipe=" + idEquipe;
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

    //Mise à jour des infos d'une équipe enregistrée
    udpateEnregistrementEquipe(nomEquipe : string, idEquipe : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateEnregistrementEquipe?&nomEquipe="+ nomEquipe + "&idEquipe="+idEquipe  +"&idChefQuart=" + this.idUser;
        
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

    //Supprimer une une équipe enregistrée
    deleteEnregistrementEquipe(idEquipe : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/deleteEnregistrementEquipe/"+idEquipe;
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

    //Supprimer les Rondiers d'une équipe enregistre
    deleteEnregistrementAffectationEquipe(idEquipe : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/deleteEnregistrementAffectationEquipe/"+idEquipe;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }



    /****Actualités *******/

    //Créer une nouvelle actualité
    newActu(titre:string, importance:number, dateDeb:string, dateFin:string, description : string, forQuart : number, maillist : string){
        titre = encodeURIComponent(titre);
        description = encodeURIComponent(description);
        let requete = "https://"+this.ip+":"+this.portAPI+"/actu?titre="+titre+"&importance="+importance+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&idUsine="+this.idUsine+"&description="+description+"&isQuart="+forQuart+"&maillist="+maillist;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
          .put<any>(requete,null,requestOptions);
    }

    //Modifier une actualité
    updateActu(titre:string, importance:number, dateDeb:string, dateFin:string, idActu : number, description : string, forQuart : number){
        titre = encodeURIComponent(titre);
        description = encodeURIComponent(description);
        let requete = "https://"+this.ip+":"+this.portAPI+"/updateActu?titre="+titre+"&importance="+importance+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&idActu="+idActu+"&description="+description+"&isQuart="+forQuart;

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

    //Récupérer toutes actualité avec la date courante entre la date de début et la date de fin
    getAllActuDateCourante(){
      let requete = "https://"+this.ip+":"+this.portAPI+"/getAllActuDateCourante?idUsine="+this.idUsine;

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<any>(requete,requestOptions);
    }

    //Récupérer toutes actualité étant lié à un quart
    getActusQuart(isQuart : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getActusQuart?idUsine="+this.idUsine+"&isQuart="+isQuart;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Valider une actualité => permet enfaite de la lier à un quart
    validerActu(idActu : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/validerActu?idActu="+idActu;

        const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
        };

        return this.http
        .put<any>(requete,null,requestOptions);
    }

    //invalider une actualité => permet enfaite de ne pas la lier à un quart
    invaliderActu(idActu : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/invaliderActu?idActu="+idActu;

        const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
        };

        return this.http
        .put<any>(requete,null,requestOptions);
    }

  //Récupérer les actus d'une usine entre deux dates avec filtre sur le nom et l'importance
  getActusEntreDeuxDates(dateDeb : string, dateFin : string, titre : string, importance : number){
      titre = encodeURIComponent(titre)
      let requete = "https://"+this.ip+":"+this.portAPI+"/getActusEntreDeuxDates?idUsine="+this.idUsine+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&titre="+titre+"&importance="+importance

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<any>(requete,requestOptions);
  }

  //Supprimer une actu
  deleteActu(id : number){
    let requete = "https://"+this.ip+":"+this.portAPI+"/deleteActu/"+id;
    //console.log(requete);

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

        const headers = new HttpHeaders();
        // @ts-ignore
        headers.append('Content-Type', null);
        headers.append('Accept', 'application/json');
        const requestOptions = {
          headers: headers,
        };

        let requete = "https://"+this.ip+":"+this.portAPI+"/evenement?titre="+titre+"&importance="+importance+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&idUsine="+this.idUsine+"&groupementGMAO="+groupementGMAO+"&equipementGMAO="+equipementGMAO+"&cause="+cause+"&description="+description+"&consigne="+consigne+"&demandeTravaux="+demandeTravaux;
        if(fileToUpload != undefined){
            const formData = new FormData();
            formData.append('fichier', fileToUpload, fileToUpload.name);
    
            return this.http
            .put<any>(requete,formData,requestOptions);
        }
        else {
            return this.http
            .put<any>(requete,null,requestOptions);
        }
        
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
   

    //Récupérer un évènement
    getOneEvenement(idEvenement : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getOneEvenement?idEvenement="+idEvenement;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Récupérer tout les évènements
    getAllEvenement(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getAllEvenement?idUsine="+this.idUsine;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Récupérer toutes les évènements entre deux dates
    getEvenementsEntreDeuxDates(dateDeb : string, dateFin : string, titre : string, groupementGMAO : string, equipementGMAO : string, importance : number){
        titre = encodeURIComponent(titre)

        let requete = "https://"+this.ip+":"+this.portAPI+"/getEvenementsEntreDeuxDates?idUsine="+this.idUsine+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&titre="+titre+"&groupementGMAO="+groupementGMAO+"&equipementGMAO="+equipementGMAO+"&importance="+importance;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Récupérer tout les évènements d'une ronde
    getEvenementsRonde(dateDeb : string, dateFin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getEvenementsRonde?idUsine="+this.idUsine+"&dateDeb="+dateDeb+"&dateFin="+dateFin;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Supprimer une évènement
    deleteEvenement(id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/deleteEvenement/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .put<any>(requete,null,requestOptions);
    }

    //Calendrier

    //Récupérer toutes les zones du calendrier
    getAllZonesCalendrier(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getAllZonesCalendrier?idUsine="+this.idUsine;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Récupérer les zones d'une ronde du calendrier
    getZonesCalendrierRonde(dateDeb : string, dateFin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getZonesCalendrierRonde?idUsine="+this.idUsine+"&dateDeb="+dateDeb+"&dateFin="+dateFin;;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Récupérer une équipe sur une ronde
    getEquipeRonde(quart : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getEquipeRonde?idUsine="+this.idUsine+"&quart="+quart;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Récupérer une équipe sur un  quart
    getEquipeQuart(quart : number, date : string){
        date = encodeURIComponent(date)
        let requete = "https://"+this.ip+":"+this.portAPI+"/getEquipeQuart?idUsine="+this.idUsine+"&quart="+quart+"&date="+date;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Récupérer toutes les ation du calendrier
    getAllActionsCalendrier(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getAllActionsCalendrier?idUsine="+this.idUsine;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Créer une nouvelle zone dans le calendrier
    newCalendrierZone(idRonde:number, dateDeb:string, quart:number, dateFin:string){

        let requete = "https://"+this.ip+":"+this.portAPI+"/newCalendrierZone?idRonde="+idRonde+"&quart="+quart+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&idUsine="+this.idUsine;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
          .put<any>(requete,null,requestOptions);
    }

    //Créer une nouvelle action dans le calendrier
    newCalendrierAction(idAction:number, dateDeb:string, quart:number, dateFin:string, termine:number){

        let requete = "https://"+this.ip+":"+this.portAPI+"/newCalendrierAction?idAction="+idAction+"&quart="+quart+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&idUsine="+this.idUsine+"&termine="+termine;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
          .put<any>(requete,null,requestOptions);
    }

    //Modifier une action dans le calendrier
    updateCalendrierAction(idAction:number, dateDeb:string, quart:number, dateFin:string){

        let requete = "https://"+this.ip+":"+this.portAPI+"/updateCalendrierAction?idAction="+idAction+"&quart="+quart+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&idUsine="+this.idUsine;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
          .put<any>(requete,null,requestOptions);
    }

    //Créer une nouvelle actualité
    newAction(nom:string, dateDeb:string, dateFin:string){
      nom = encodeURIComponent(nom);
      let requete = "https://"+this.ip+":"+this.portAPI+"/newAction?nom="+nom+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&idUsine="+this.idUsine;

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
        .put<any>(requete,null,requestOptions);
    }
    
    //Récupérer toutes les actus d'une ronde
    getActusRonde(dateDeb : string, dateFin : string){
      let requete = "https://"+this.ip+":"+this.portAPI+"/getActusRonde?idUsine="+this.idUsine+"&dateDeb="+dateDeb+"&dateFin="+dateFin;

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .get<any>(requete,requestOptions);
    }

    //Supprimer un évènement du calendrier
    deleteCalendrier(id : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/deleteCalendrier/"+id;
        //console.log(requete);

        const requestOptions = {
            headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .delete<any>(requete,requestOptions);
    }

    //Supprimer les évenement suivants de celui choisi (pour supprimer occurence sur une action)
    deleteEvents(id : number){
      let requete = "https://"+this.ip+":"+this.portAPI+"/deleteEventsSuivant/"+id;

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .delete<any>(requete,requestOptions);
    }


    ////Actions////

    //Récupérer toutes les actions d'une ronde
    getActionsRonde(dateDeb : string, dateFin : string){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getActionsRonde?idUsine="+this.idUsine+"&dateDeb="+dateDeb+"&dateFin="+dateFin;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Récupérer toutes les action
    getAllAction(){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getAllAction?idUsine="+this.idUsine;

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

    //Récupérer toutes les action entre deux dates d'une usine avec filtre sur le titre et l'importance
    getActionsEntreDeuxDates(dateDeb : string, dateFin : string, titre : string){
        titre = encodeURIComponent(titre)
        let requete = "https://"+this.ip+":"+this.portAPI+"/getActionsEntreDeuxDates?idUsine="+this.idUsine+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&titre="+titre

        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };

        return this.http
            .get<any>(requete,requestOptions);
    }

  //Récupérer une action
  getOneAction(idAction : number){
    let requete = "https://"+this.ip+":"+this.portAPI+"/getOneAction?idAction="+idAction;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
        .get<any>(requete,requestOptions);
  }

  //Modifier une action
  updateAction(nom:string, dateDeb:string, dateFin:string, idAction : number){
    nom = encodeURIComponent(nom);
    let requete = "https://"+this.ip+":"+this.portAPI+"/updateAction?nom="+nom+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&idAction="+idAction;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }

  ////Consignes


  //Récupérer une consigne
 getOneConsigne(idConsigne : number){
        let requete = "https://"+this.ip+":"+this.portAPI+"/getOneConsigne?idConsigne="+idConsigne;
  
        const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
        };
  
        return this.http
            .get<any>(requete,requestOptions);
    }

  //Récupérer toutes les consignes entre deux dates d'une usine avec filtre sur le titre et l'importance
  getConsignesRecherche(dateDeb : string, dateFin : string, titre : string){
    titre = encodeURIComponent(titre)
    let requete = "https://"+this.ip+":"+this.portAPI+"/getConsignesRecherche?idUsine="+this.idUsine+"&dateDeb="+dateDeb+"&dateFin="+dateFin+"&titre="+titre

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
        .get<any>(requete,requestOptions);
  }


  ////////////////////
  //  Liens externes//
  ////////////////////

  getOneLienExterne(idLien : number){
    let requete = "https://"+this.ip+":"+this.portAPI+"/getOneLienExterne?idLien="+idLien

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
        .get<any>(requete,requestOptions);
  }

  getAllLiensExternes(){
    let requete = "https://"+this.ip+":"+this.portAPI+"/getAllLiensExternes?idUsine="+this.idUsine

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
        .get<any>(requete,requestOptions);
  }

  getActifsLiensExternes(){
    let requete = "https://"+this.ip+":"+this.portAPI+"/getActifsLiensExternes?idUsine="+this.idUsine

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
        .get<any>(requete,requestOptions);
  }

  updateLienExterne(nom : string, url : string, idLien : number){
    nom = encodeURIComponent(nom);
    url = encodeURIComponent(url);
    let requete = "https://"+this.ip+":"+this.portAPI+"/updateLienExterne?nom="+nom+"&url="+url+"&idLien="+idLien;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }

  newLienExterne(nom : string, url : string){
    let requete = "https://"+this.ip+":"+this.portAPI+"/newLienExterne?nom="+nom+"&url="+url+"&idUsine="+this.idUsine;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }

  //Activer un lien
  activerLien(idLien : number){
    let requete = "https://"+this.ip+":"+this.portAPI+"/activerLien?idLien="+idLien;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }

  //Désactiver un lien
  desactiverLien(idLien : number){
    let requete = "https://"+this.ip+":"+this.portAPI+"/desactiverLien?idLien="+idLien;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }

    //Supprimer un lien externe
    deleteLienExterne(id : number){
      let requete = "https://"+this.ip+":"+this.portAPI+"/deleteLienExterne?idLien="+id;

      const requestOptions = {
          headers: new HttpHeaders(this.headerDict),
      };

      return this.http
          .delete<any>(requete,requestOptions);
    }


  ////////////////////
  //    Historique  //
  ////////////////////

  //Créer un nouvel historique d'évènement
  historiqueEvenementCreate(idEvenement:number){

    var dateHeure : any = new Date();
    dateHeure = this.datePipe.transform(dateHeure,'yyyy-MM-dd HH:mm');
    let requete = "https://"+this.ip+":"+this.portAPI+"/historiqueEvenementCreate?idUser="+this.idUser+"&idEvenement="+idEvenement+"&dateHeure="+dateHeure+"&idUsine="+this.idUsine;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }

  //Créer un nouvel historique d'évènement
  historiqueEvenementUpdate(idEvenement:number){

    var dateHeure : any = new Date();
    dateHeure = this.datePipe.transform(dateHeure,'yyyy-MM-dd HH:mm');
    let requete = "https://"+this.ip+":"+this.portAPI+"/historiqueEvenementUpdate?idUser="+this.idUser+"&idEvenement="+idEvenement+"&dateHeure="+dateHeure+"&idUsine="+this.idUsine;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }

  //Créer un nouvel historique d'évènement
  historiqueEvenementDelete(idEvenement:number){

    var dateHeure : any = new Date();
    dateHeure = this.datePipe.transform(dateHeure,'yyyy-MM-dd HH:mm');
    let requete = "https://"+this.ip+":"+this.portAPI+"/historiqueEvenementDelete?idUser="+this.idUser+"&idEvenement="+idEvenement+"&dateHeure="+dateHeure+"&idUsine="+this.idUsine;
  
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  
    return this.http
      .put<any>(requete,null,requestOptions);
  }

  //Créer un nouvel historique de prise de quart
  historiquePriseQuart(){

    var dateHeure : any = new Date();
    dateHeure = this.datePipe.transform(dateHeure,'yyyy-MM-dd HH:mm');
    let requete = "https://"+this.ip+":"+this.portAPI+"/historiquePriseQuart?idUser="+this.idUser+"&dateHeure="+dateHeure+"&idUsine="+this.idUsine;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }

  //Créer un nouvel historique d'actu
  historiqueActuCreate(idActu:number){

    var dateHeure : any = new Date();
    dateHeure = this.datePipe.transform(dateHeure,'yyyy-MM-dd HH:mm');
    let requete = "https://"+this.ip+":"+this.portAPI+"/historiqueActuCreate?idUser="+this.idUser+"&idActu="+idActu+"&dateHeure="+dateHeure+"&idUsine="+this.idUsine;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }

  //Créer un nouvel historique d'actu
  historiqueActuUpdate(idActu:number){

    var dateHeure : any = new Date();
    dateHeure = this.datePipe.transform(dateHeure,'yyyy-MM-dd HH:mm');
    let requete = "https://"+this.ip+":"+this.portAPI+"/historiqueActuUpdate?idUser="+this.idUser+"&idActu="+idActu+"&dateHeure="+dateHeure+"&idUsine="+this.idUsine;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }

  //Créer un nouvel historique de consigne
  historiqueConsigneCreate(idConsigne:number){

    var dateHeure : any = new Date();
    dateHeure = this.datePipe.transform(dateHeure,'yyyy-MM-dd HH:mm');
    let requete = "https://"+this.ip+":"+this.portAPI+"/historiqueConsigneCreate?idUser="+this.idUser+"&idConsigne="+idConsigne+"&dateHeure="+dateHeure+"&idUsine="+this.idUsine;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }

  //Créer un nouvel historique de consgine
  historiqueConsigneUpdate(idConsigne:number){

    var dateHeure : any = new Date();
    dateHeure = this.datePipe.transform(dateHeure,'yyyy-MM-dd HH:mm');
    let requete = "https://"+this.ip+":"+this.portAPI+"/historiqueConsigneUpdate?idUser="+this.idUser+"&idConsigne="+idConsigne+"&dateHeure="+dateHeure+"&idUsine="+this.idUsine;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }
  //Créer un nouvel historique de consgine
  historiqueConsigneDelete(idConsigne:number){

    var dateHeure : any = new Date();
    dateHeure = this.datePipe.transform(dateHeure,'yyyy-MM-dd HH:mm');
    let requete = "https://"+this.ip+":"+this.portAPI+"/historiqueConsigneDelete?idUser="+this.idUser+"&idConsigne="+idConsigne+"&dateHeure="+dateHeure+"&idUsine="+this.idUsine;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,null,requestOptions);
  }


  /** STOCKAGE DU PDF DE RECAP PRECEDENT pour un envoi par mail*/
  //?idUsine=1
  stockageRecapPDF(fichier: File | undefined, quart : string, date : string){
    //utilisation de formData pour conserver le format du fichier
    const formData = new FormData();
    // @ts-ignore
    formData.append('fichier', fichier, fichier.name);
    let requete = "https://"+this.ip+":"+this.portAPI+"/stockageRecapQuart?idUsine="+this.idUsine+"&quart="+quart+"&date="+date;

    const headers = new HttpHeaders();
    // @ts-ignore
    headers.append('Content-Type', null);
    headers.append('Accept', 'application/json');

    const requestOptions = {
      headers: headers,
    };

    return this.http.post<any>(requete,formData,requestOptions);
  }

}