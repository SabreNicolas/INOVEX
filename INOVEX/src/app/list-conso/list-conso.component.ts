import { Component, OnInit } from "@angular/core";
import { productsService } from "../services/products.service";
import { NgForm } from "@angular/forms";
import { product } from "../../models/products.model";
import { moralEntitiesService } from "../services/moralentities.service";
import { dateService } from "../services/date.service";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-list-conso",
  templateUrl: "./list-conso.component.html",
  styleUrls: ["./list-conso.component.scss"],
})
export class ListConsoComponent implements OnInit {
  public listConsos: product[];
  public listDays: string[];
  public dateDeb: Date | undefined;
  public dateFin: Date | undefined;

  constructor(
    private productsService: productsService,
    private popupService: PopupService,
    private mrService: moralEntitiesService,
    private dateService: dateService,
  ) {
    this.listConsos = [];
    this.listDays = [];
  }

  ngOnInit(): void {
    this.productsService.getConsos().subscribe((response) => {
      // @ts-ignore
      this.listConsos = response.data;
      this.getValues();
    });
  }

  setPeriod(form: NgForm) {
    this.listDays = [];
    this.dateDeb = new Date(
      (<HTMLInputElement>document.getElementById("dateDeb")).value,
    );
    this.dateFin = new Date(
      (<HTMLInputElement>document.getElementById("dateFin")).value,
    );
    if (this.dateFin < this.dateDeb) {
      this.dateService.mauvaiseEntreeDate(form);
    }
    this.listDays = this.dateService.getDays(this.dateDeb, this.dateFin);
    this.getValues();
  }

  //valider la saisie des tonnages
  validation() {
    this.listDays.forEach((day) => {
      this.listConsos.forEach((con) => {
        var value = (<HTMLInputElement>(
          document.getElementById(con.Id + "-" + day)
        )).value.replace(",", ".");
        var Value2 = value.replace(" ", "");
        var valueInt: number = +Value2;
        if (valueInt > 0.0) {
          this.mrService
            .createMeasure(
              day.substr(6, 4) +
                "-" +
                day.substr(3, 2) +
                "-" +
                day.substr(0, 2),
              valueInt,
              con.Id,
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

  //récupérer les tonnages en BDD
  getValues() {
    this.listDays.forEach((day) => {
      this.listConsos.forEach((con) => {
        this.productsService
          .getValueProducts(
            day.substr(6, 4) + "-" + day.substr(3, 2) + "-" + day.substr(0, 2),
            con.Id,
          )
          .subscribe((response) => {
            if (response.data[0] != undefined && response.data[0].Value != 0) {
              (<HTMLInputElement>(
                document.getElementById(con.Id + "-" + day)
              )).value = response.data[0].Value;
            } else
              (<HTMLInputElement>(
                document.getElementById(con.Id + "-" + day)
              )).value = "";
          });
      });
    });
  }

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
  setCurrentMonth(form: NgForm) {
    this.dateService.setCurrentMonth(form);
    this.setPeriod(form);
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
          (<HTMLInputElement>document.getElementById(Id + "-" + date)).value =
            "";
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors de la suppression de la valeur ....",
          );
        }
      });
  }
}
