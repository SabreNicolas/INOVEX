import { Component, OnInit } from "@angular/core";
import { rapport } from "src/models/rapport.model";
import { rapportsService } from "../services/rapports.service";
import { user } from "../../models/user.model";

@Component({
  selector: "app-list-rapports",
  templateUrl: "./list-rapports.component.html",
  styleUrls: ["./list-rapports.component.scss"],
})
export class ListRapportsComponent implements OnInit {
  public listRapports: rapport[];
  public userLogged!: user;
  public idUsine: number;
  public usine: string;
  public isSuperAdmin: boolean;

  constructor(private rapportsService: rapportsService) {
    this.listRapports = [];
    this.usine = "";
    this.isSuperAdmin = false;
    this.idUsine = 0;
  }

  ngOnInit(): void {
    window.parent.document.title = "CAP Exploitation - Rapports";

    //récupération des rapports
    this.rapportsService.getRapports().subscribe((response) => {
      // @ts-expect-error data
      this.listRapports = response.data;
    });

    const userLogged = localStorage.getItem("user");
    if (typeof userLogged === "string") {
      const userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;
      //Récupération de l'idUsine
      // @ts-expect-error data
      this.idUsine = this.userLogged["idUsine"];
      if (this.userLogged.hasOwnProperty("localisation")) {
        //@ts-expect-error data
        this.usine = this.userLogged["localisation"];
        this.isSuperAdmin = true;
      }
    }
  }

  download(url: string) {
    window.location.assign(url);
  }
}
