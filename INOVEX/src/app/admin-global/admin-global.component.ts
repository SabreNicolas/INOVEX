import { Component, OnInit } from "@angular/core";
import { categoriesService } from "../services/categories.service";
import { user } from "src/models/user.model";
import * as pdfMake from "pdfmake/build/pdfMake";
import * as pdfFonts from "pdfMake/build/vfs_fonts";
import { rondierService } from "../services/rondier.service";

//@ts-expect-error data
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-admin-global",
  templateUrl: "./admin-global.component.html",
  styleUrls: ["./admin-global.component.scss"],
})
export class AdminGlobalComponent implements OnInit {
  public isSuperAdmin: boolean;
  public isAdmin: boolean;
  public idUsine: number;
  public userLogged!: user;
  public usine: string;
  private listZones: any[];

  constructor(
    private categoriesService: categoriesService,
    private rondierService: rondierService,
  ) {
    this.isSuperAdmin = false;
    this.isAdmin = false;
    this.idUsine = 0;
    this.usine = "";
    this.listZones = [];
  }

  ngOnInit(): void {
    window.parent.document.title = "CAP Exploitation - Admin";

    //La création de produit est uniquement possible par les superAdmin
    //dans le but d'avoir un référentiel produit unique
    //La création d'un produit, le cré pour l'ensemble des sites
    const userLogged = localStorage.getItem("user");
    if (typeof userLogged === "string") {
      const userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;
      //Si une localisation est stocké dans le localstorage, c'est que c'est un superAdmin et qu'il a choisi le site au début
      if (this.userLogged.hasOwnProperty("localisation")) {
        this.isSuperAdmin = true;
      }
      this.isAdmin = this.userLogged["isAdmin"];
      // @ts-expect-error data
      this.idUsine = this.userLogged["idUsine"];
      // @ts-expect-error data
      this.usine = this.userLogged["localisation"];
    }

    //stockage de l'ensemble des sites dans le le service categories pour la création de produit pour l'ensemble des sites
    this.categoriesService.getSites().subscribe((response) => {
      //@ts-expect-error data
      this.categoriesService.sites = response.data;
    });
  }

  download(file: string) {
    window.open(file, "_blank");
  }

  pdfMake() {
    // console.log("pdfMake start");
    const tableHeader = [
      {
        text: "Element de contrôle",
        margin: [0, 0, 0, 0],
        fontSize: 8,
        fillColor: "#dddddd",
      },
      {
        text: "Matin",
        margin: [0, 0, 0, 0],
        fontSize: 8,
        fillColor: "#dddddd",
      },
      {
        text: "Après-midi",
        margin: [0, 0, 0, 0],
        fontSize: 8,
        fillColor: "#dddddd",
      },
      { text: "Nuit", margin: [0, 0, 0, 0], fontSize: 8, fillColor: "#dddddd" },
    ];

    const data = [
      { text: "Auteur de la ronde" },
      { text: "Chef de quart" },
      { text: "Four 1 en fonctionnement ?" },
      { text: "Four 2 en fonctionnement ?" },
    ];

    const tableBody = data.map((item) => {
      return [
        {
          text: item.text,
          margin: [0, 0, 0, 0],
          fontSize: 8,
          style: "tableCell",
        },
        { text: "", margin: [0, 0, 0, 0], fontSize: 8, style: "tableCell" },
        { text: "", margin: [0, 0, 0, 0], fontSize: 8, style: "tableCell" },
        { text: "", margin: [0, 0, 0, 0], fontSize: 8, style: "tableCell" },
      ];
    });

    this.rondierService.listZonesAndElements().subscribe(async (response) => {
      let dataToAdd: any[] = [];
      //@ts-expect-error data
      this.listZones = response.BadgeAndElementsOfZone;
      for await (const zone of this.listZones) {
        dataToAdd.push({
          text: zone.zone,
          style: "tableHeader",
          fontSize: 8,
          color: "#007FFF",
          colSpan: 4,
          alignment: "center",
          margin: [0, 0, 0, 0],
        });
        tableBody.push(dataToAdd);
        dataToAdd = [];

        if (zone.elements[0] != undefined) {
          //Si on a un groupement -> on l'affiche
          if (zone.elements[0].groupement != null) {
            dataToAdd.push({
              text: zone.elements[0].groupement,
              fontSize: 8,
              style: "tableHeader",
              color: "#FF7F50",
              colSpan: 4,
              alignment: "left",
              margin: [0, 0, 0, 0],
            });
            tableBody.push(dataToAdd);
            dataToAdd = [];
          }
          dataToAdd.push(
            {
              text: [
                { text: zone.elements[0].nom + "\n " },
                {
                  text: "unit : " + zone.elements[0].unit + "\n",
                  color: "red",
                },
                {
                  text:
                    "bornes : " +
                    zone.elements[0].valeurMin +
                    " - " +
                    zone.elements[0].valeurMax,
                  color: "blue",
                },
              ],
              fontSize: 8,
              style: "tableHeader",
              margin: [0, 0, 0, 0],
            },
            {
              text: zone.elements[0].listValues.replace(/ /g, " / "),
              fontSize: 8,
              alignment: "center",
              valign: "middle",
              margin: [0, 0, 0, 0],
              style: "tableCell",
            },
            {
              text: zone.elements[0].listValues.replace(/ /g, " / "),
              fontSize: 8,
              alignment: "center",
              valign: "middle",
              margin: [0, 0, 0, 0],
              style: "tableCell",
            },
            {
              text: zone.elements[0].listValues.replace(/ /g, " / "),
              fontSize: 8,
              alignment: "center",
              valign: "middle",
              margin: [0, 0, 0, 0],
              style: "tableCell",
            },
          );
          tableBody.push(dataToAdd);
          dataToAdd = [];
        }
        for (let i = 1; i < zone.elements.length; i++) {
          //Si le groupement est différent du groupement de l'élément précédent, on affiche le groupement
          if (zone.elements[i].groupement != zone.elements[i - 1].groupement) {
            dataToAdd.push({
              text: zone.elements[i].groupement,
              fontSize: 8,
              style: "tableHeader",
              color: "#FF7F50",
              colSpan: 4,
              alignment: "left",
              margin: [0, 0, 0, 0],
            });
            tableBody.push(dataToAdd);
            dataToAdd = [];
          }
          dataToAdd.push(
            {
              text: [
                { text: zone.elements[i].nom + "\n " },
                {
                  text: "unit : " + zone.elements[i].unit + "\n",
                  color: "red",
                },
                {
                  text:
                    "bornes : " +
                    zone.elements[i].valeurMin +
                    " - " +
                    zone.elements[i].valeurMax,
                  color: "blue",
                },
              ],
              fontSize: 8,
              style: "tableHeader",
              margin: [0, 0, 0, 0],
            },
            {
              text: zone.elements[i].listValues.replace(/ /g, " / "),
              fontSize: 8,
              alignment: "center",
              valign: "middle",
              margin: [0, 0, 0, 0],
              style: "tableCell",
            },
            {
              text: zone.elements[i].listValues.replace(/ /g, " / "),
              fontSize: 8,
              alignment: "center",
              valign: "middle",
              margin: [0, 0, 0, 0],
              style: "tableCell",
            },
            {
              text: zone.elements[i].listValues.replace(/ /g, " / "),
              fontSize: 8,
              alignment: "center",
              valign: "middle",
              margin: [0, 0, 0, 0],
              style: "tableCell",
            },
          );
          tableBody.push(dataToAdd);
          dataToAdd = [];
        }
      }
      //@ts-expect-error data
      tableBody.unshift(tableHeader);
      const pdfContent = {
        content: [
          {
            text: "Ronde du : ",
            style: "header",
            alignment: "center",
            fontSize: 18,
            bold: true,
          },
          {
            table: {
              widths: ["31%", "23%", "23%", "23%"],
              body: tableBody,
            },
          },
        ],
      };
      //@ts-expect-error data
      pdfMake.createPdf(pdfContent).download("repriseRonde.pdf");
    });
  }
}
