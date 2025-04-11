import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { idUsineService } from "./idUsine.service";
import { environment } from "src/environments/environment";
import {
  choixDepassement,
  choixDepassementProduit,
  depassement,
  depassementProduit,
  nbLignesUsine,
} from "../../models/depassement.model";

@Injectable()
export class depassementsService {
  httpClient: HttpClient;
  private headerDict = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  private ip = environment.apiUrl;
  private idUsine: number | undefined;

  constructor(
    private http: HttpClient,
    private idUsineService: idUsineService,
  ) {
    this.httpClient = http;
    this.idUsine = this.idUsineService.getIdUsine();
  }

  //récupérer les choix dépassements
  getChoixDepassements() {
    const requete = "https://" + this.ip + "/choixDepassements";

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<choixDepassement[]>(requete, requestOptions);
  }

  //créer un choix dépassement
  createChoixDepassement(nom: string) {
    const requete = "https://" + this.ip + "/choixDepassements?nom=" + nom;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.post<string>(requete, null, requestOptions);
  }

  getchoixDepassementsProduits() {
    const requete = "https://" + this.ip + "/choixDepassementsProduits";

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<choixDepassementProduit[]>(requete, requestOptions);
  }

  createChoixDepassementProduit(nom: string) {
    const requete =
      "https://" + this.ip + "/choixDepassementsProduits?nom=" + nom;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.post<string>(requete, null, requestOptions);
  }

  deleteChoixDepassement(id: number) {
    const requete = "https://" + this.ip + "/choixDepassements/" + id;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<string>(requete, requestOptions);
  }
  deleteChoixDepassementProduit(id: number) {
    const requete = "https://" + this.ip + "/choixDepassementsProduits/" + id;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<string>(requete, requestOptions);
  }

  getDepassementsProduits() {
    const requete = "https://" + this.ip + "/depassementsProduits";

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<depassementProduit[]>(requete, requestOptions);
  }

  createDepassementProduit(
    idChoixDepassements: number,
    idChoixDepassementsProduits: number,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/depassementsProduits?idChoixDepassements=" +
      idChoixDepassements +
      "&idChoixDepassementsProduits=" +
      idChoixDepassementsProduits;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.post<string>(requete, null, requestOptions);
  }

  deleteDepassementProduit(id: number) {
    const requete = "https://" + this.ip + "/depassementsProduits/" + id;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<string>(requete, requestOptions);
  }

  getNbLignesUsine() {
    const requete = "https://" + this.ip + "/nbLigne/" + this.idUsine;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<nbLignesUsine>(requete, requestOptions);
  }

  createDepassement(depassement: depassement) {
    const requete = "https://" + this.ip + "/depassementsNew";
    depassement.idUsine = this.idUsine;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.post<string>(requete, depassement, requestOptions);
  }

  getDepassements() {
    const requete =
      "https://" + this.ip + "/depassementsNew?idUsine=" + this.idUsine;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<depassement[]>(requete, requestOptions);
  }

  getDepassementsByDate(dateDeb: string, dateFin: string) {
    const requete =
      "https://" +
      this.ip +
      "/depassementsNew?idUsine=" +
      this.idUsine +
      "&date_heure_debut=" +
      dateDeb +
      "&date_heure_fin=" +
      dateFin;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<depassement[]>(requete, requestOptions);
  }

  updateDepassement(depassement: depassement) {
    console.log(depassement);
    const requete = "https://" + this.ip + "/depassementsNew";

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<string>(requete, depassement, requestOptions);
  }

  deleteDepassement(id: number) {
    const requete = "https://" + this.ip + "/depassementsNew/" + id;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<string>(requete, requestOptions);
  }
}
