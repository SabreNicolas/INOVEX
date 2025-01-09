import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { rapport } from "src/models/rapport.model";
import { idUsineService } from "./idUsine.service";
import { environment } from "src/environments/environment";

@Injectable()
export class rapportsService {
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

  //récupérer les rapports pour l'usine sur laquelle on se trouve
  getRapports() {
    const requete = "https://" + this.ip + "/rapports/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<rapport[]>(requete, requestOptions);
  }

  //récupérer les rapports pour l'usine sur laquelle on se trouve
  getModeOPs() {
    const requete = "https://" + this.ip + "/rapports/5";
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<rapport[]>(requete, requestOptions);
  }
}
