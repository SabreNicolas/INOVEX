import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { arret } from "../../models/arrets.model";
import { sumArret } from "../../models/sumArret.model";
import { depassement } from "../../models/depassement.model";
import { sumDepassement } from "../../models/sumDepassement.model";
import { idUsineService } from "./idUsine.service";
import { environment } from "src/environments/environment";

@Injectable()
export class arretsService {
  httpClient: HttpClient;
  private headerDict = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  private ip = environment.apiUrl;
  //private ip = "localhost";
  private idUsine: number | undefined;

  constructor(
    private http: HttpClient,
    private idUsineService: idUsineService,
  ) {
    this.httpClient = http;
    this.idUsine = this.idUsineService.getIdUsine();
  }

  /**
   * DEPASSEMENTS
   */

  //insérer un dépassement
  createDepassement(
    dateDebut: string,
    dateFin: string,
    duree: number,
    idUser: number,
    dateSaisie: string,
    description: string,
    productId: number,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/Depassement?dateDebut=" +
      dateDebut +
      "&dateFin=" +
      dateFin +
      "&duree=" +
      duree +
      "&user=" +
      idUser +
      "&dateSaisie=" +
      dateSaisie +
      "&description=" +
      description +
      "&productId=" +
      productId;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //récupérer l'historique des arrêts pour un mois
  getDepassements(dateDebut: string, dateFin: string) {
    const requete =
      "https://" +
      this.ip +
      "/Depassements/" +
      dateDebut +
      "/" +
      dateFin +
      "/" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<depassement[]>(requete, requestOptions);
  }

  //récupérer un dépassement
  getOneDepassement(id: number) {
    const requete = "https://" + this.ip + "/getOneDepassement/" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<depassement[]>(requete, requestOptions);
  }

  //récupérer un arrêt
  getOneArret(id: number) {
    const requete = "https://" + this.ip + "/getOneArret/" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<depassement[]>(requete, requestOptions);
  }

  //récupérer la somme des dépassements pour un mois
  getDepassementsSum(dateDebut: string, dateFin: string) {
    const requete =
      "https://" +
      this.ip +
      "/DepassementsSum/" +
      dateDebut +
      "/" +
      dateFin +
      "/" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<sumDepassement>(requete, requestOptions);
  }

  //récupérer la somme des dépassements pour un mois et pour four 1
  getDepassementsSumFour(dateDebut: string, dateFin: string, numFour: number) {
    const requete =
      "https://" +
      this.ip +
      "/DepassementsSumFour/" +
      dateDebut +
      "/" +
      dateFin +
      "/" +
      this.idUsine +
      "/" +
      numFour;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<sumDepassement>(requete, requestOptions);
  }

  //delete dépassements
  deleteDepassement(id: number) {
    const requete = "https://" + this.ip + "/DeleteDepassement/" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }

  /**
   * ARRETS
   */

  //insérer un arrêt
  createArret(
    dateDebut: string,
    dateFin: string,
    duree: number,
    idUser: number,
    dateSaisie: string,
    description: string,
    productId: number,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/Arrets?dateDebut=" +
      dateDebut +
      "&dateFin=" +
      dateFin +
      "&duree=" +
      duree +
      "&user=" +
      idUser +
      "&dateSaisie=" +
      dateSaisie +
      "&description=" +
      description +
      "&productId=" +
      productId;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //modifier un arrêt
  updateArret(
    id: number,
    dateDebut: string,
    dateFin: string,
    duree: number,
    idUser: number,
    dateSaisie: string,
    description: string,
    productId: number,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/updateArret/" +
      id +
      "?dateDebut=" +
      dateDebut +
      "&dateFin=" +
      dateFin +
      "&duree=" +
      duree +
      "&user=" +
      idUser +
      "&dateSaisie=" +
      dateSaisie +
      "&description=" +
      description +
      "&productId=" +
      productId;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //modifier un dépassement
  updateDepassement(
    id: number,
    dateDebut: string,
    dateFin: string,
    duree: number,
    idUser: number,
    dateSaisie: string,
    description: string,
    productId: number,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/updateDepassement/" +
      id +
      "?dateDebut=" +
      dateDebut +
      "&dateFin=" +
      dateFin +
      "&duree=" +
      duree +
      "&user=" +
      idUser +
      "&dateSaisie=" +
      dateSaisie +
      "&description=" +
      description +
      "&productId=" +
      productId;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //récupérer l'historique des arrêts pour un mois
  getArrets(dateDebut: string, dateFin: string) {
    const requete =
      "https://" +
      this.ip +
      "/Arrets/" +
      dateDebut +
      "/" +
      dateFin +
      "/" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<arret[]>(requete, requestOptions);
  }

  //récupérer la somme des arrêts par type pour un mois
  getArretsType(dateDebut: string, dateFin: string) {
    const requete =
      "https://" +
      this.ip +
      "/ArretsSumGroup/" +
      dateDebut +
      "/" +
      dateFin +
      "/" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<sumArret>(requete, requestOptions);
  }

  //récupérer la somme des arrêts pour un mois
  getArretsSum(dateDebut: string, dateFin: string) {
    const requete =
      "https://" +
      this.ip +
      "/ArretsSum/" +
      dateDebut +
      "/" +
      dateFin +
      "/" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<sumArret>(requete, requestOptions);
  }

  //récupérer la somme des arrêts pour un mois et pour 1 four
  getArretsSumFour(dateDebut: string, dateFin: string, numFour: number) {
    const requete =
      "https://" +
      this.ip +
      "/ArretsSumFour/" +
      dateDebut +
      "/" +
      dateFin +
      "/" +
      this.idUsine +
      "/" +
      numFour;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<sumArret>(requete, requestOptions);
  }

  //delete arret
  deleteArret(id: number) {
    const requete = "https://" + this.ip + "/DeleteArret/" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }

  //envoi d'un mail pour alerter
  sendEmail(
    dateDeb: string,
    heureDeb: string,
    duree: number,
    typeArret: string,
    commentaire: string,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/sendmail/" +
      dateDeb +
      "/" +
      heureDeb +
      "/" +
      duree +
      "/" +
      typeArret +
      "/" +
      commentaire +
      "/" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any>(requete, requestOptions);
  }
}
