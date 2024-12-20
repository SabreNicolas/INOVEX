import { Component, OnInit } from "@angular/core";
import { productsService } from "../services/products.service";
import { categoriesService } from "../services/categories.service";
import { category } from "src/models/categories.model";
import { NgForm } from "@angular/forms";
import { product } from "../../models/products.model";
import { moralEntitiesService } from "../services/moralentities.service";
import { ActivatedRoute, Router } from "@angular/router";
import { dateService } from "../services/date.service";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-analyses",
  templateUrl: "./analyses.component.html",
  styleUrls: ["./analyses.component.scss"],
})
export class AnalysesComponent implements OnInit {
  public listCategories: category[];
  public listAnalyses: product[];
  public Code: string;
  public listDays: string[];
  public isPCI = false; // 'true' si on saisie des pci et 'false' si analyses

  constructor(
    private productsService: productsService,
    private popupService: PopupService,
    private categoriesService: categoriesService,
    private mrService: moralEntitiesService,
    private route: ActivatedRoute,
    private router: Router,
    private dateService: dateService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; //permet de recharger le component au changement de paramètre
    this.listCategories = [];
    this.listAnalyses = [];
    this.Code = "";
    this.listDays = [];
    this.route.queryParams.subscribe((params) => {
      if (params.pci.includes("true")) {
        this.isPCI = true;
        this.getPCI();
      } else {
        this.isPCI = false;
        this.getAnalyses();
      }
    });
  }

  ngOnInit(): void {}

  getAnalyses() {
    this.categoriesService.getCategoriesAnalyses().subscribe((response) => {
      // @ts-ignore
      this.listCategories = response.data;
    });

    this.productsService.getAnalyses(this.Code).subscribe((response) => {
      // @ts-ignore
      this.listAnalyses = response.data;
      this.getValues();
    });
  }

  getPCI() {
    this.productsService.getPCI().subscribe((response) => {
      // @ts-ignore
      this.listAnalyses = response.data;
      this.getValues();
    });
  }

  setFilters() {
    const codeCat = document.getElementById("categorie");
    // @ts-ignore
    const codeCatSel = codeCat.options[codeCat.selectedIndex].value;
    this.Code = codeCatSel;
    /*Fin de prise en commpte des filtres */
    this.getAnalyses();
  }

  setPeriod(form: NgForm) {
    this.listDays = [];
    if (form.value["dateDeb"] != "") {
      const date = new Date(form.value["dateDeb"]);
      const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
      const yyyy = date.getFullYear();
      const dd = String(
        new Date(yyyy, date.getMonth() + 1, 0).getDate(),
      ).padStart(2, "0");
      this.listDays.push(dd + "/" + mm + "/" + yyyy);
      this.getValues();
    } else {
      this.popupService.alertErrorForm("Date invalide");
    }
  }

  //changer les dates pour saisir le mois précédent
  setLastMonth(form: NgForm) {
    this.dateService.setLastMonth(form);
    this.setPeriod(form);
  }

  setYear() {
    this.listDays = this.dateService.setYear();
    this.getValues();
  }

  //afficher le dernier jour de chaque mois de l'année en cours
  setLastYear() {
    this.listDays = this.dateService.setLastYear();
    this.getValues();
  }

  //récupérer les valeurs en BDD
  getValues() {
    this.listAnalyses.forEach((an) => {
      this.listDays.forEach((day) => {
        this.productsService
          .getValueProducts(
            day.substr(6, 4) + "-" + day.substr(3, 2) + "-" + day.substr(0, 2),
            an.Id,
          )
          .subscribe((response) => {
            if (response.data[0] != undefined && response.data[0].Value != 0) {
              (
                document.getElementById(an.Id + "-" + day) as HTMLInputElement
              ).value = response.data[0].Value;
            } else
              (
                document.getElementById(an.Id + "-" + day) as HTMLInputElement
              ).value = "";
          });
      });
    });
  }

  //valider les saisies
  validation() {
    this.listAnalyses.forEach((an) => {
      this.listDays.forEach((day) => {
        const value = (
          document.getElementById(an.Id + "-" + day) as HTMLInputElement
        ).value.replace(",", ".");
        const valueInt: number = +value;
        if (valueInt > 0.0) {
          this.mrService
            .createMeasure(
              day.substr(6, 4) +
                "-" +
                day.substr(3, 2) +
                "-" +
                day.substr(0, 2),
              valueInt,
              an.Id,
              0,
            )
            .subscribe((response) => {
              if (response == "Création du Measures OK") {
                this.popupService.alertSuccessForm(
                  "Les valeurs ont été insérées avec succès !",
                );
              } else {
                this.popupService.alertErrorForm(
                  "Erreur lors de l'insertion des valeurs ....",
                );
              }
            });
        }
      });
    });
  }

  //mettre à 0 la value pour modificiation
  delete(Id: number, date: string) {
    this.mrService
      .createMeasure(
        date.substr(6, 4) + "-" + date.substr(3, 2) + "-" + date.substr(0, 2),
        0,
        Id,
        0,
      )
      .subscribe((response) => {
        if (response == "Création du Measures OK") {
          this.popupService.alertSuccessForm("La valeur a bien été supprimé !");
          (document.getElementById(Id + "-" + date) as HTMLInputElement).value =
            "";
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors de la suppression de la valeur ....",
          );
        }
      });
  }
}
