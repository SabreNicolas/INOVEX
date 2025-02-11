import { Component, OnInit } from "@angular/core";
import { moralEntitiesService } from "../services/moralentities.service";
import Swal from "sweetalert2";
import { moralEntity } from "../../models/moralEntity.model";
import { dechetsCollecteurs } from "src/models/dechetsCollecteurs.model";
import { user } from "src/models/user.model";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-import-tonnage",
  templateUrl: "./import-tonnage.component.html",
  styleUrls: ["./import-tonnage.component.scss"],
})
export class ImportTonnageComponent implements OnInit {
  public moralEntities: any[];
  public debCode: string;
  public listId: number[];
  private listTypeDechetsCollecteurs: dechetsCollecteurs[];
  public listTypeDechets: string[];
  public listCollecteurs: string[];
  public nomImport: string;
  public productImport: string;

  constructor(
    private moralEntitiesService: moralEntitiesService,
    private popupService: PopupService,
  ) {
    this.debCode = "";
    this.listId = [];
    this.moralEntities = [];
    this.listTypeDechetsCollecteurs = [];
    this.listTypeDechets = [];
    this.listCollecteurs = [];
    this.nomImport = "";
    this.productImport = "";
  }

  ngOnInit(): void {
    this.moralEntitiesService
      .getMoralEntitiesAndCorrespondance(this.debCode)
      .subscribe((response) => {
        // @ts-expect-error data
        this.moralEntities = response.data;
        //Récupération des types de déchets et des collecteurs
        this.moralEntitiesService.GetTypeDéchets().subscribe((response) => {
          //@ts-expect-error data
          this.listTypeDechetsCollecteurs = response.data;

          //On boucle maintenant sur ce tableau pour scindé en déchets / collecteurs avec les codes associés
          this.listTypeDechetsCollecteurs.forEach((typeDechetsCollecteurs) => {
            let typeDechets, collecteur, regroupType;

            //ON regroupe les noms DIB et DEA en 1 seul
            if (
              typeDechetsCollecteurs.Name.split(" ")[0] == "DIB" ||
              typeDechetsCollecteurs.Name.split(" ")[0] == "DEA"
            ) {
              regroupType = "DIB/DEA";
            } else regroupType = typeDechetsCollecteurs.Name.split(" ")[0];
            typeDechets =
              typeDechetsCollecteurs.Code.substring(0, 3) + "_" + regroupType;

            //GESTION cas spécifique DIB/DEA
            if (typeDechetsCollecteurs.Code.length > 5) {
              collecteur =
                typeDechetsCollecteurs.Code.substring(3, 5) +
                "_" +
                typeDechetsCollecteurs.Name.split(" ")[1];
            } else {
              collecteur =
                typeDechetsCollecteurs.Code.substring(3) +
                "_" +
                typeDechetsCollecteurs.Name.split(" ")[1];
            }

            if (!this.listTypeDechets.includes(typeDechets)) {
              this.listTypeDechets.push(typeDechets);
            }
            if (!this.listCollecteurs.includes(collecteur)) {
              this.listCollecteurs.push(collecteur);
            }
          });
        });
      });
  }

  setFilters() {
    /* Début prise en compte des filtres*/
    const produitElt = document.getElementById("produit");
    // @ts-expect-error data
    const produitSel = produitElt.options[produitElt.selectedIndex].value;
    const collecteurElt = document.getElementById("collecteur");
    const collecteurSel =
      //@ts-expect-error data
      collecteurElt.options[collecteurElt.selectedIndex].value;
    this.debCode = produitSel + collecteurSel;
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  //Fonction pour attendre
  wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  //Mise à jour du nom de l'import ou du produit
  edition(
    ProducerId: number,
    ProductId: number,
    nomImport: string,
    productImport: string,
    type: string,
  ) {
    //On récupère la correspondance pour voir si elle est déjà existante
    const verifNomImport = nomImport;
    const verifProductImport = productImport;
    //On demande à l'utilisateur de siaire soit le nom soit le produit
    if (type == "nom") {
      if (nomImport == null) {
        //@ts-expect-error data
        nomImport = prompt(
          "Veuillez saisir le nom de l'apporteur dans le logiciel de pesée",
          "",
        );
      } else
        //@ts-expect-error data
        nomImport = prompt(
          "Veuillez saisir le nom de l'apporteur dans le logiciel de pesée",
          nomImport,
        );
      if (productImport == null) productImport = "_";
    } else {
      if (productImport == null) {
        //@ts-expect-error data
        productImport = prompt(
          "Veuillez saisir le nom du produit dans le logiciel de pesée",
          "",
        );
      } else
        //@ts-expect-error data
        productImport = prompt(
          "Veuillez saisir le nom du produit dans le logiciel de pesée",
          productImport,
        );
      if (nomImport == null) nomImport = "_";
    }
    // if(productImport == null || nomImport == null) return;
    productImport = productImport.replace(/'/g, "''");
    nomImport = nomImport.replace(/'/g, "''");
    if (productImport == "") {
      productImport = "_";
    }
    if (nomImport == "") {
      nomImport = "_";
    }
    //Si on a une correspondance, on met à jour celle ci
    if (verifNomImport != null || verifProductImport != null) {
      this.moralEntitiesService
        .updateCorrespondance(ProducerId, nomImport, productImport)
        .subscribe((response) => {
          this.popupService.alertSuccessForm("Correspondance modifiée");
          this.ngOnInit();
        });
    }
    //Sinon on la crée
    else {
      this.moralEntitiesService
        .createImport_tonnage(ProducerId, ProductId, nomImport, productImport)
        .subscribe((response) => {
          this.popupService.alertSuccessForm("Correspondance ajoutée");
          this.ngOnInit();
        });
    }
  }
}
