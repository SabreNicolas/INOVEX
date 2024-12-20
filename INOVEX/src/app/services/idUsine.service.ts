import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class idUsineService {
  getIdUsine() {
    const userLogged = localStorage.getItem("user");
    if (typeof userLogged === "string") {
      const userLoggedParse = JSON.parse(userLogged);

      //Récupération de l'idUsine
      // @ts-ignore
      return userLoggedParse["idUsine"];
    }
  }

  getIdUser() {
    const userLogged = localStorage.getItem("user");
    if (typeof userLogged === "string") {
      const userLoggedParse = JSON.parse(userLogged);

      //Récupération de l'user
      // @ts-ignore
      return userLoggedParse["Id"];
    }
  }
}
