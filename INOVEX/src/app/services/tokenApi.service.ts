import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class tokenApiService {
  httpClient: HttpClient;
  private headerDict = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  private ip = environment.apiUrl;
  //private ip = "localhost";

  constructor(private http: HttpClient) {
    this.httpClient = http;
    //Récupération du user dans localStorage
    const userLogged = localStorage.getItem("user");
    if (typeof userLogged === "string") {
      const userLoggedParse = JSON.parse(userLogged);
    }
  }
  //Génération de token d'accès pour swagger
  generateAcessToken(saisie: string) {
    const requete = "https://" + this.ip + "/accesToken?affectation=" + saisie;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }
  //Fonction permettant de récupérer tout les token actifs de l'api
  getAllTokens() {
    const requete = "https://" + this.ip + "/allAccesTokens";
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any>(requete, requestOptions);
  }
  //Fonction permettant de désactiver un token
  desactivateToken(id: number) {
    const requete = "https://" + this.ip + "/desactivateToken?id=" + id;

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }
  //Fonction permettant de modifier l'affectation d'un token
  updateToken(id: number, saisie: string) {
    const requete =
      "https://" + this.ip + "/updateToken?affectation=" + saisie + "&id=" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }
}
