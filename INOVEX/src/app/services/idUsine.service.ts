import { Injectable } from "@angular/core";

@Injectable()
export class idUsineService {
  getIdUsine() {
    const userLogged = localStorage.getItem("user");
    if (typeof userLogged === "string") {
      const userLoggedParse = JSON.parse(userLogged);

      //Récupération de l'idUsine
      return userLoggedParse["idUsine"];
    }
  }

  getIdUser() {
    const userLogged = localStorage.getItem("user");
    if (typeof userLogged === "string") {
      const userLoggedParse = JSON.parse(userLogged);

      //Récupération de l'user
      return userLoggedParse["Id"];
    }
  }
}
