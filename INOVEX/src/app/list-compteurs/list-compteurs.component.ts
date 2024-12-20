import { Component, OnInit } from "@angular/core";
import { productsService } from "../services/products.service";
import { categoriesService } from "../services/categories.service";
import { category } from "src/models/categories.model";
import { product } from "../../models/products.model";
import { NgForm } from "@angular/forms";
import * as XLSX from "xlsx";
import { dateService } from "../services/date.service";
import { moralEntitiesService } from "../services/moralentities.service";
import { idUsineService } from "../services/idUsine.service";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-list-compteurs",
  templateUrl: "./list-compteurs.component.html",
  styleUrls: ["./list-compteurs.component.scss"],
})
export class ListCompteursComponent implements OnInit {
  public listCategories: category[];
  public listCompteurs: product[];
  public Code: string;
  public listDays: string[];
  public idUsine: number | undefined;
  public dateDeb: Date | undefined;
  public dateFin: Date | undefined;
  public name: string;

  constructor(
    private idUsineService: idUsineService,
    private popupService: PopupService,
    private productsService: productsService,
    private categoriesService: categoriesService,
    private dateService: dateService,
    private mrService: moralEntitiesService,
  ) {
    this.listCategories = [];
    this.listCompteurs = [];
    this.Code = "";
    this.listDays = [];
    this.name = "";

    this.idUsine = this.idUsineService.getIdUsine();
  }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((response) => {
      // @ts-ignore
      this.listCategories = response.data;
    });

    this.productsService
      .getCompteurs(this.Code, this.name)
      .subscribe((response) => {
        // @ts-ignore
        this.listCompteurs = response.data;
        this.getValues();
      });
  }

  //Fonction pour attendre
  wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  setFilters() {
    const codeCat = document.getElementById("categorie");
    //@ts-ignore
    const verif = codeCat.options[codeCat.selectedIndex];
    if (verif != undefined) {
      // @ts-ignore
      var codeCatSel = codeCat.options[codeCat.selectedIndex].value;
    } else var codeCatSel = "";

    this.Code = codeCatSel;
    const name = (document.getElementById("name") as HTMLInputElement).value;
    this.name = name.replace(/'/g, "''");
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  loading() {
    var element = document.getElementById("spinner");
    // @ts-ignore
    element.classList.add("loader");
    var element = document.getElementById("spinnerBloc");
    // @ts-ignore
    element.classList.add("loaderBloc");
  }

  removeloading() {
    var element = document.getElementById("spinner");
    // @ts-ignore
    element.classList.remove("loader");
    var element = document.getElementById("spinnerBloc");
    // @ts-ignore
    element.classList.remove("loaderBloc");
  }

  async setPeriod(form: NgForm) {
    //SI Pithiviers
    /*if(this.idUsine == 3){
      this.listDays = [];
      if(form.value['dateDeb'] != ''){
        var date = new Date(form.value['dateDeb']);
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        var dd = String(new Date(yyyy, date.getMonth()+1, 0).getDate()).padStart(2, '0');
        this.listDays.push(dd + '/' + mm + '/' + yyyy);
      }
      else{
        this.popupService.alertErrorForm('Date invalide')
      }
    }//Sinon on affiche en journalier
    else {*/
    this.listDays = [];
    this.dateDeb = new Date(
      (document.getElementById("dateDeb") as HTMLInputElement).value,
    );
    this.dateFin = new Date(
      (document.getElementById("dateFin") as HTMLInputElement).value,
    );
    if (this.dateFin < this.dateDeb) {
      this.dateService.mauvaiseEntreeDate(form);
    }
    if (
      (this.dateFin.getTime() - this.dateDeb.getTime()) /
        (1000 * 60 * 60 * 24) >=
      29
    ) {
      this.loading();
    }
    this.listDays = this.dateService.getDays(this.dateDeb, this.dateFin);
    //}
    //On récupère les valeurs
    await this.getValues();
    this.removeloading();
  }

  /**
   * PARTIE SAISIE JOUR
   */

  //changer les dates pour saisir hier
  setYesterday(form: NgForm) {
    this.dateService.setYesterday(form);
    this.setPeriod(form);
  }

  //changer les dates pour saisir la semaine en cours
  setCurrentWeek(form: NgForm) {
    this.dateService.setCurrentWeek(form);
    this.setPeriod(form);
  }

  //changer les dates pour saisir le mois en cours
  async setCurrentMonth(form: NgForm) {
    this.loading();
    this.dateService.setCurrentMonth(form);
    await this.setPeriod(form);
    this.removeloading();
  }

  /**
   * FIN PARTIE SAISIE JOUR
   */

  /**
   * SAISIE MOIS
   */

  //changer les dates pour saisir le mois précédent
  setLastMonth(form: NgForm) {
    this.dateService.setLastMonth(form);
    this.setPeriod(form);
  }

  //afficher le dernier jour de chaque mois de l'année en cours
  setYear() {
    this.listDays = this.dateService.setYear();
    this.getValues();
  }

  //afficher le dernier jour de chaque mois de l'année en cours
  setLastYear() {
    this.listDays = this.dateService.setLastYear();
    this.getValues();
  }
  /**
   * FIN SAISIE MOIS
   */

  //récupérer les valeurs en BDD
  async getValues() {
    let i = 0;
    for (const date of this.listDays) {
      for (const pr of this.listCompteurs) {
        i++;
        //temporisation toutes les 400 req pour libérer de l'espace
        if (i >= 400) {
          i = 0;
          await this.wait(500);
        }
        //Si on est sur chinon on récupère les valeurs dans saisiemensuelle
        if (this.idUsine == 2) {
          this.productsService
            .getValueCompteurs(
              date.substr(6, 4) +
                "-" +
                date.substr(3, 2) +
                "-" +
                date.substr(0, 2),
              pr.Code,
            )
            .subscribe((response) => {
              if (
                response.data[0] != undefined &&
                response.data[0].Value != 0
              ) {
                (document.getElementById(pr.Code + "-" + date) as HTMLInputElement).value = response.data[0].Value;
                (document.getElementById("export-" + pr.Code + "-" + date) as HTMLInputElement).innerHTML = response.data[0].Value;
              } else
                (document.getElementById(pr.Code + "-" + date) as HTMLInputElement).value = "";
            });
        }
        //sinon on récupère les valeurs dans maasure new
        else {
          this.productsService
            .getValueProducts(
              date.substr(6, 4) +
                "-" +
                date.substr(3, 2) +
                "-" +
                date.substr(0, 2),
              pr.Id,
            )
            .subscribe((response) => {
              if (
                response.data[0] != undefined &&
                response.data[0].Value != 0
              ) {
                (document.getElementById(pr.Code + "-" + date) as HTMLInputElement).value = response.data[0].Value;
                (document.getElementById("export-" + pr.Code + "-" + date) as HTMLInputElement).innerHTML = response.data[0].Value;
              } else
                (document.getElementById(pr.Code + "-" + date) as HTMLInputElement).value = "";
            });
        }
      }
    }
  }

  //valider les saisies
  validation() {
    this.listCompteurs.forEach((cp) => {
      this.listDays.forEach((day) => {
        const value = (document.getElementById(cp.Code + "-" + day) as HTMLInputElement).value.replace(",", ".");
        const Value2 = value.replace(" ", "");
        const valueInt: number = +Value2;
        if (valueInt > 0.0) {
          //Si on est sur chinon, on insère les valeurs dans saisiemensuelle
          if (this.idUsine == 2) {
            this.productsService
              .createMeasure(
                day.substr(6, 4) +
                  "-" +
                  day.substr(3, 2) +
                  "-" +
                  day.substr(0, 2),
                valueInt,
                cp.Code,
              )
              .subscribe((response) => {
                if (response == "Création du saisiemensuelle OK") {
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
          //sinon on récupère les valeurs dans measure_new
          else {
            this.mrService
              .createMeasure(
                day.substr(6, 4) +
                  "-" +
                  day.substr(3, 2) +
                  "-" +
                  day.substr(0, 2),
                valueInt,
                cp.Id,
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
        }
      });
    });
  }

  //mettre à 0 la value pour modificiation
  //On supprime les valeurs dans measure_new
  delete(Id: number, date: string, Code: string) {
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
          (document.getElementById(Code + "-" + date) as HTMLInputElement).value =
            "";
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors de la suppression de la valeur ....",
          );
        }
      });
  }

  //mettre à 0 la value pour modificiation
  //Si on est sur chinon ou pit, on supprime les valeurs dans saisiemensuelle
  deleteCompteur(Code: string, date: string) {
    this.productsService
      .createMeasure(
        date.substr(6, 4) + "-" + date.substr(3, 2) + "-" + date.substr(0, 2),
        0,
        Code,
      )
      .subscribe((response) => {
        if (response == "Création du saisiemensuelle OK") {
          this.popupService.alertSuccessForm("La valeur a bien été supprimé !");
          (document.getElementById(Code + "-" + date) as HTMLInputElement).value =
            "";
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors de la suppression de la valeur ....",
          );
        }
      });
  }

  //Export de la table dans fichier EXCEL
  exportExcel() {
    /* table id is passed over here */
    const element = document.getElementById("listCompteurs");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {
      raw: false,
      dateNF: "mm/dd/yyyy",
    }); //Attention les jours sont considérés comme mois !!!!

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Comppteurs");

    /* save to file */
    XLSX.writeFile(wb, "compteurs.xlsx");
  }
}
