import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { maintenance } from "src/models/maintenance.model";
import { site } from "src/models/site.model";
import { category } from "../../models/categories.model";
import { idUsineService } from "./idUsine.service";
import { environment } from "src/environments/environment";

@Injectable()
export class categoriesService {
  private _nom: string;
  private _code: string;
  private _parentId: number;
  public sites: site[];

  httpClient: HttpClient;
  private headerDict = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  private ip = environment.apiUrl;
  //private ip = "localhost";

  constructor(
    private http: HttpClient,
    private idUsineService: idUsineService,
  ) {
    this.httpClient = http;
    this._nom = "";
    this._code = "";
    this._parentId = 0;
    this.sites = [];
    //@ts-ignore
    this.idUsine = this.idUsineService.getIdUsine();
  }

  //création de catégorie
  createCategory() {
    let requete =
      "https://" +
      this.ip +
      "/Category?Name=" +
      this._nom +
      "&Code=" +
      this._code +
      "&ParentId=" +
      this._parentId;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //récupérer les categories de compteurs
  getCategories() {
    let requete = "https://" + this.ip + "/CategoriesCompteurs";
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<category[]>(requete, requestOptions);
  }

  //récupérer les categories d'analyses
  getCategoriesAnalyses() {
    let requete = "https://" + this.ip + "/CategoriesAnalyses";
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<category[]>(requete, requestOptions);
  }

  //récupérer les categories de sortants
  getCategoriesSortants() {
    let requete = "https://" + this.ip + "/CategoriesSortants";
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<category[]>(requete, requestOptions);
  }

  /*
   ***** PARTIE CHOIX SITE POUR SUPER ADMIN
   */

  //récupérer les différents sites
  getSites() {
    let requete = "https://" + this.ip + "/sites";
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<site[]>(requete, requestOptions);
  }

  /*
   ***** PARTIE MAINTENANCE
   */

  //récupérer la maintenance prévue
  getMaintenance() {
    let requete = "https://" + this.ip + "/Maintenance";
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<maintenance>(requete, requestOptions);
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

  get listSites(): site[] {
    return this.sites;
  }

  set listSites(value: site[]) {
    this.sites = value;
  }
}
