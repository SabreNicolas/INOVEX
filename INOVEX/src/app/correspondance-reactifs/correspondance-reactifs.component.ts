import { Component, OnInit } from "@angular/core";
import { moralEntitiesService } from "../services/moralentities.service";
import Swal from "sweetalert2";
import { productsService } from "../services/products.service";
import { categoriesService } from "../services/categories.service";
import { category } from "src/models/categories.model";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-correspondance-reactifs",
  templateUrl: "./correspondance-reactifs.component.html",
  styleUrls: ["./correspondance-reactifs.component.scss"],
})
export class CorrespondanceReactifsComponent implements OnInit {
  public listReactifsAvecCorrespondance: any[];
  public listReactifs: any[];
  public nomAjout: string;
  public produitACreer: number;

  constructor(
    private productsService: productsService,
    private popupService: PopupService,
    private categoriesService: categoriesService,
    private moralEntitiesService: moralEntitiesService,
  ) {
    this.listReactifsAvecCorrespondance = [];
    this.listReactifs = [];
    this.nomAjout = "";
    this.produitACreer = 0;
  }

  ngOnInit(): void {
    this.productsService
      .getReactifsAndCorrespondance()
      .subscribe((response) => {
        // @ts-expect-error data
        this.listReactifsAvecCorrespondance = response.data;
        // console.log(this.listReactifsAvecCorrespondance);
      });

    this.productsService.getReactifs().subscribe((response) => {
      // @ts-expect-error data
      this.listReactifs = response.data;
    });
  }

  //Fonction pour attendre
  wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  editionProductImport(idCorrespondance: number) {
    const idCorrespondanceString = idCorrespondance + "";
    const typeElt = document.getElementById(idCorrespondanceString);
    // @ts-expect-error data
    const productId = typeElt.options[typeElt.selectedIndex].value;
    if (productId != "") {
      this.moralEntitiesService
        .updateProductImportCorrespondanceReactif(idCorrespondance, productId)
        .subscribe((response) => {
          this.popupService.alertSuccessForm("Correspondance modifiée");
          this.ngOnInit();
        });
    }
  }

  //Mise à jour du nom de l'import ou du produit
  editionNomImport(productId: number, productImport: string) {
    //On récupère la correspondance pour voir si elle est déjà existante
    //@ts-expect-error data
    productImport = prompt(
      "Veuillez saisir le nom du produit dans le logiciel de pesée",
      productImport,
    );

    // if(productImport == null || nomImport == null) return;
    productImport = productImport.replace(/'/g, "''");
    if (productImport == "") {
      productImport = "_";
    }
    // Si on a une correspondance, on met à jour celle ci
    this.moralEntitiesService
      .updateNomImportCorrespondanceReactif(productId, productImport)
      .subscribe((response) => {
        this.popupService.alertSuccessForm("Correspondance modifiée");
        this.ngOnInit();
      });
  }

  createCorrespondance(productImport: string, productId: number) {
    productImport = productImport.replace(/'/g, "''");
    if (productId != 0) {
      this.moralEntitiesService
        .createImport_tonnageReactif(productId, productImport)
        .subscribe((response) => {
          this.popupService.alertSuccessForm("Correspondance ajoutée");
          this.ngOnInit();
        });
    }
  }

  supprimer(idCorrespondance: number) {
    Swal.fire({
      title:
        "Êtes-vous sûr(e) de vouloir supprimer cette zone et tout ses éléments ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.moralEntitiesService
          .deleteCorrespondanceReactif(idCorrespondance)
          .subscribe((response) => {
            if (response == "Suppression de la correspondance OK") {
              this.popupService.alertSuccessForm(
                "La correspondance a été supprimée !",
              );
              this.ngOnInit();
            } else {
              this.popupService.alertErrorForm(
                "Erreur lors de Suppression ....",
              );
            }
          });
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La suprression a été annulée.");
      }
    });
  }
}
