import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { idUsineService } from "./idUsine.service";

@Injectable({
  providedIn: "root",
})
export class AltairService {
  private headerDict = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  // private portAPI = 3102;
  private ip = "/altairrest";
  //private ip = "localhost";
  private idUsine: number | undefined;

  constructor(
    private http: HttpClient,
    private idUsineService: idUsineService,
  ) {
    //@ts-ignore
    this.idUsine = this.idUsineService.getIdUsine();
  }

  //Récupérer la liste des "equipements"
  getEquipements(token: string) {
    const requete = this.ip + "/rest/refdata/all/equipment/list/EQUIPMENT";
    //enlever status rebut
    const requestOptions = new HttpHeaders({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    });

    const headers = {
      headers: requestOptions,
    };
    const url = requete;

    return this.http.get<any>(url, headers);
  }

  //Récupérer la liste des "location"
  getLocations(token: string) {
    const requete = this.ip + "/rest/refdata/all/location/list/LOCATION";
    //enlever status rebut
    const requestOptions = new HttpHeaders({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    });

    const headers = {
      headers: requestOptions,
    };
    const url = requete;

    return this.http.get<any>(url, headers);
  }

  //Se connecter
  login() {
    const requete = this.ip + "/rest/system/login";

    const requestOptions = new HttpHeaders(this.headerDict);

    const headers = {
      headers: requestOptions,
    };
    const url = requete;
    let site = "";
    switch (this.idUsine) {
      case 1:
        site = "NOYELLES";
        break;
      case 2:
        break;
      case 3:
        site = "PITHIVIERS";
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        site = "SAINT-SAULVE";
        break;
      case 7:
        site = "CALCE";
        break;
      case 8:
        site = "MAUBEUGE";
        break;
      case 9:
        site = "DUNKERQUE";
        break;
      case 10:
        site = "DOUCHY";
        break;
      case 11:
        break;
      case 12:
        site = "PLOUHARNEL";
        break;
      case 13:
        site = "PLUZUNET";
        break;
      case 14:
        break;
      case 15:
        break;
      case 16:
        site = "GIEN";
        break;
      case 17:
        site = "VILLEFRANCHE";
        break;
      case 18:
        site = "MOURENX";
        break;
      case 19:
        site = "SETE";
        break;
      case 20:
        break;
      case 21:
        break;
      case 22:
        site = "SAINT-OUEN";
        break;
      case 23:
        break;
      case 24:
        break;
      case 25:
        break;
      case 26:
        site = "PONTEX";
        break;
      case 27:
        break;
      case 28:
        site = "LANTIC";
        break;
      case 29:
        break;
      case 30:
        site = "CALCE";
        break;
    }
    const payload =
      '{\r\n  "username":"capexploitation",\r\n  "password":"capexploitation",\r\n  "site":"' +
      site +
      '",\r\n  "passwordprehashed": false\r\n\r\n}';

    return this.http.post<any>(url, payload, headers);
  }

  //Créer une DI
  createDI(
    token: string,
    description: string,
    fkcodelocalisation: string,
    fkcodeequipment: string,
    failurecode: string,
    priority: number,
    wrm1: string,
  ) {
    //Par défaut on renseigne le user GMAO CAP Exploitation
    let userGMAO = "capexploitation";

    //On récupère le login GMAO de l'ustilisateur
    const userLogged = localStorage.getItem("user");
    if (typeof userLogged === "string") {
      const userLoggedParse = JSON.parse(userLogged);

      //Récupération de lu login GMAO
      if (userLoggedParse["loginGMAO"] != "") {
        //ON update le login GMAO si on connait le login du user
        userGMAO = userLoggedParse["loginGMAO"];
      }
    }
    /**FIN RECUP USER GMAO */

    const requete = this.ip + "/rest/work/all/workrequest/create/WORKREQUEST";
    // console.log(userGMAO);

    const requestOptions = new HttpHeaders({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      accept: "application/json",
    });

    const headers = {
      headers: requestOptions,
    };

    const url = requete;

    if (priority == 0) {
      var prio = "BASSE";
    } else if (priority == 1) {
      var prio = "MOYENNE";
    } else var prio = "HAUTE";
    const payload =
      '{\r\n  "description": "' +
      description +
      '",\r\n  "fkcodelocation": "' +
      fkcodelocalisation +
      '",\r\n  "fkcodeequipment": "' +
      fkcodeequipment +
      '",\r\n  "wrm1": "' +
      wrm1 +
      '",\r\n  "priority": "' +
      prio +
      '",\r\n  "failurecode": "' +
      failurecode +
      '",\r\n  "createdby": "' +
      userGMAO +
      '"\r\n}';

    return this.http.post<any>(url, payload, headers);
  }

  //Récupérer les maintenances
  getMaintenance(token: string) {
    const requete = this.ip + "/rest/work/all/workorder/list/WORKORDER";

    const requestOptions = new HttpHeaders({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    });

    const headers = {
      headers: requestOptions,
    };

    const url = requete;

    return this.http.get<any>(url, headers);
  }

  //Récupérer une DI
  getOneDI(token: string, id: string) {
    const requete =
      this.ip + "/rest/work/all/workrequest/show/workrequest/" + id;
    //enlever status rebut
    const requestOptions = new HttpHeaders({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    });

    const headers = {
      headers: requestOptions,
    };
    const url = requete;

    return this.http.get<any>(url, headers);
  }

  //Récupérer un BT
  getOneDT(token: string, id: string) {
    const requete = this.ip + "/rest/work/all/workorder/show/workorder/" + id;
    //enlever status rebut
    const requestOptions = new HttpHeaders({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    });

    const headers = {
      headers: requestOptions,
    };
    const url = requete;

    return this.http.get<any>(url, headers);
  }
}
