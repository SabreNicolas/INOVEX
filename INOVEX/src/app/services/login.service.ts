import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { user } from "../../models/user.model";
import { idUsineService } from "./idUsine.service";
import { environment } from "src/environments/environment";

@Injectable()
export class loginService {
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
    //@ts-ignore
    this.idUsine = this.idUsineService.getIdUsine();
  }

  //création d'utilisateur
  createUser(
    nom: string,
    prenom: string,
    login: string,
    pwd: string,
    isRondier: number,
    isSaisie: number,
    isQSE: number,
    isRapport: number,
    isChefQuart: number,
    isAdmin: number,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/User?nom=" +
      nom +
      "&prenom=" +
      prenom +
      "&login=" +
      login +
      "&pwd=" +
      pwd +
      "&isRondier=" +
      isRondier +
      "&isSaisie=" +
      isSaisie +
      "&isQSE=" +
      isQSE +
      "&isRapport=" +
      isRapport +
      "&isChefQuart=" +
      isChefQuart +
      "&isAdmin=" +
      isAdmin +
      "&idUsine=" +
      this.idUsine;
    console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //récupérer la list des utilisateurs
  getAllUsers(loginLike: string) {
    const requete =
      "https://" +
      this.ip +
      "/Users?login=" +
      loginLike +
      "&idUsine=" +
      this.idUsine;
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
    return this.http.get<user[]>(requete, requestOptions);
  }

  //récupérer la list des utilisateurs ayant un email
  getUsersEmail() {
    const requete =
      "https://" + this.ip + "/UsersEmail?idUsine=" + this.idUsine;
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
    return this.http.get<user[]>(requete, requestOptions);
  }

  //récupérer le login pour voir si il est déjà utilisé
  getLogin(login: string) {
    const requete = "https://" + this.ip + "/User/" + login;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<user>(requete, requestOptions);
  }

  //récupérer l'utilisateur qui se connecte
  getUserLoged(login: string, pwd: string) {
    const requete = "https://" + this.ip + "/User/" + login + "/" + pwd;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<user>(requete, requestOptions);
  }

  //Mise à jour mot de pase utilisateur
  updatePwd(login: string, pwd: string) {
    const requete = "https://" + this.ip + "/User/" + login + "/" + pwd;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //Mise à jour des droits rondier ou saisie ou qse ou rapports ou chef de quart ou admin
  updateDroit(login: string, droit: number, choix: string) {
    const requete =
      "https://" + this.ip + "/" + choix + "/" + login + "/" + droit;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
    return this.http.put<any>(requete, null, requestOptions);
  }

  //Mise à jour des infos => email ou loginGMAO
  updateInfos(login: string, info: string, infoValue: string) {
    const requete =
      "https://" +
      this.ip +
      "/UserInfos/" +
      login +
      "/" +
      info +
      "?infoValue=" +
      infoValue;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
    return this.http.put<any>(requete, null, requestOptions);
  }

  //delete user
  deleteUser(id: number) {
    const requete = "https://" + this.ip + "/user/" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }
}
