import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { maintenance } from "src/models/maintenance.model";
import { site } from "src/models/site.model";
import Swal from "sweetalert2";
import { user } from "../../models/user.model";
import { categoriesService } from "../services/categories.service";
import { rapportsService } from "../services/rapports.service";

@Component({
  selector: "app-acceuil",
  templateUrl: "./acceuil.component.html",
  styleUrls: ["./acceuil.component.scss"],
})
export class AcceuilComponent implements OnInit {
  public userLogged!: user;
  public nom: string;
  public prenom: string;
  public MD5pwd: string;
  public login: string;
  public isRondier: boolean; //0 ou 1
  public isSaisie: boolean; //0 ou 1
  public isQSE: boolean; //0 ou 1
  public isRapport: boolean; //0 ou 1
  public isAdmin: boolean; //0 ou 1
  public isChefQuart: boolean; //0 ou 1
  public idUsine: number;
  public localisation: string;
  public sites: site[];
  public maintenance: maintenance | undefined;
  public modeOPs: string[];

  constructor(
    private router: Router,
    private categoriesService: categoriesService,
    private rapportsService: rapportsService,
  ) {
    this.nom = "";
    this.prenom = "";
    this.MD5pwd = "";
    this.login = "";
    this.isRondier = false;
    this.isSaisie = false;
    this.isQSE = false;
    this.isRapport = false;
    this.isAdmin = false;
    this.isChefQuart = false;
    this.idUsine = 0;
    this.localisation = "";
    this.sites = [];
    this.modeOPs = [];
  }

  ngOnInit(): void {
    window.parent.document.title = "CAP Exploitation";
    const userLogged = localStorage.getItem("user");
    if (typeof userLogged === "string") {
      const userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;

      //Récupération de l'idUsine
      // @ts-expect-error data
      this.idUsine = this.userLogged["idUsine"];

      //SI utilisateur GLOBAL alors choix du site à administrer/se connecter
      //Id 5 correspond à "GLOBAL"/SuperAdmin
      if (this.idUsine == 5) {
        this.choixSite();
      }
      //Sinon on récupère la localisation si elle est renseigné
      else {
        if (this.userLogged.hasOwnProperty("localisation")) {
          //@ts-expect-error data
          this.localisation = this.userLogged["localisation"];
        }
      }

      this.nom = this.userLogged["Nom"];
      this.prenom = this.userLogged["Prenom"];
      this.MD5pwd = this.userLogged["pwd"];
      this.login = this.userLogged["login"];
      this.isRondier = this.userLogged["isRondier"];
      this.isQSE = this.userLogged["isQSE"];
      this.isRapport = this.userLogged["isRapport"];
      this.isSaisie = this.userLogged["isSaisie"];
      this.isAdmin = this.userLogged["isAdmin"];
      this.isChefQuart = this.userLogged["isChefQuart"];
    }

    //On vérifie si une maintenance est prévue
    this.getMaintenance();
  }

  getMaintenance() {
    this.categoriesService.getMaintenance().subscribe((response) => {
      this.maintenance = response;
    });
  }

  navigate(route: string) {
    const newRelativeUrl = this.router.createUrlTree([route]);
    const baseUrl = window.location.href.replace(this.router.url, "");

    window.open(baseUrl + newRelativeUrl, "_blank");
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    this.router.navigate(["/"]);
  }

  choixModeOPs() {
    //Récupération des sites
    this.rapportsService.getModeOPs().subscribe((response) => {
      // @ts-expect-error data
      this.modeOPs = response.data;
      //Construction des valeurs du menu select qui contient les sites
      const listModesOPs = {};
      for (let i = 0; i < this.modeOPs.length; i++) {
        //@ts-expect-error data
        listModesOPs[this.modeOPs[i]["url"]] = this.modeOPs[i]["nom"];
      }

      Swal.fire({
        title: "Veuillez choisir un mode opératoire",
        input: "select",
        inputOptions: listModesOPs,
        showCancelButton: false,
        confirmButtonText: "Télécharger",
        allowOutsideClick: true,
      }).then((result) => {
        if (result.value != undefined) {
          window.open(result.value);
        }
      });
    });
  }

  choixSite() {
    //Récupération des sites
    this.categoriesService.getSites().subscribe((response) => {
      // @ts-expect-error data
      this.sites = response.data;
      //Construction des valeurs du menu select qui contient les sites
      const listSites: any[any] = [];
      this.sites.forEach((site) => {
        const id = String(site.id) + "_" + site.localisation;
        listSites[id] = site.localisation;
      });

      Swal.fire({
        title: "Veuillez Choisir un site",
        input: "select",
        inputOptions: listSites,
        showCancelButton: false,
        confirmButtonText: "Valider",
        allowOutsideClick: false,
      }).then((result) => {
        const usine_localisation = result.value.split("_");
        //Premier élément du tableau est l'idUsine
        //@ts-expect-error data
        this.userLogged["idUsine"] = Number(usine_localisation[0]);
        //@ts-expect-error data
        this.idUsine = this.userLogged["idUsine"];
        //2e élément du tableau est la localisation géographiques
        this.localisation = usine_localisation[1];
        //@ts-expect-error data
        this.userLogged["localisation"] = this.localisation;
        //ON met à jour le user dans le localstorage
        localStorage.setItem("user", JSON.stringify(this.userLogged));
        window.location.reload();
      });
    });
  }
}
