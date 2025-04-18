import { Component, OnInit } from "@angular/core";
import { arretsService } from "../services/arrets.service";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { rondierService } from "../services/rondier.service";
import { dateService } from "../services/date.service";
import { idUsineService } from "../services/idUsine.service";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-list-arrets",
  templateUrl: "./list-arrets.component.html",
  styleUrls: ["./list-arrets.component.scss"],
})
export class ListArretsComponent implements OnInit {
  public listArretsDepassements: any[];
  public sumArretsDepassements: any[];
  public stringDateDebut: string;
  public stringDateFin: string;
  public dateDeb: Date | undefined;
  public dateFin: Date | undefined;
  public isArret = false; // 'true' si on saisie des arrêts et 'false' si dépassements
  public nbfour: number;
  public numbers: number[];
  public nbGTA: number;
  public nbRCU: number;
  public updateAfterDelete: boolean;
  public idUsine: number | undefined;

  constructor(
    private idUsineService: idUsineService,
    private popupService: PopupService,
    private arretsService: arretsService,
    private rondierService: rondierService,
    private route: ActivatedRoute,
    private router: Router,
    private dateService: dateService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; //permet de recharger le component au changement de paramètre
    this.listArretsDepassements = [];
    this.sumArretsDepassements = [];
    this.stringDateDebut = "";
    this.stringDateFin = "";
    this.nbfour = 0;
    this.nbGTA = 0;
    this.nbRCU = 0;
    this.updateAfterDelete = false;
    this.idUsine = this.idUsineService.getIdUsine();
    //contient des chiffres pour l'itération des fours
    this.numbers = [];
    this.route.queryParams.subscribe((params) => {
      if (params.isArret.includes("true")) {
        this.isArret = true;
      } else this.isArret = false;
    });
  }

  ngOnInit(): void {
    //Récupération du nombre de four du site
    this.rondierService.nbLigne().subscribe((response) => {
      //@ts-expect-error data
      this.nbfour = response.data[0].nbLigne;
      this.numbers = Array(this.nbfour)
        .fill(1)
        .map((x, i) => i + 1);
    });

    //Récupération du nombre de GTA du site
    this.rondierService.nbGTA().subscribe((response) => {
      //@ts-expect-error data
      this.nbGTA = response.data[0].nbGTA;
    });

    //Récupération du nombre de RCU du site
    this.rondierService.nbRCU().subscribe((response) => {
      //@ts-expect-error data
      this.nbRCU = response.data[0].nbReseauChaleur;
    });

    //Si on rafraichit après un delete on n'ajoute pas les heures dans la date
    if (!this.updateAfterDelete) {
      //Permet de prendre en compte l'entiereté de la journée pour la date de début et de fin
      this.stringDateDebut = this.stringDateDebut + " 00:00:00";
      this.stringDateFin = this.stringDateFin + " 23:59:59";
    } else this.updateAfterDelete = false;

    if (this.isArret == true) {
      this.arretsService
        .getArrets(this.stringDateDebut, this.stringDateFin)
        .subscribe((response) => {
          // @ts-expect-error data
          this.listArretsDepassements = response.data;
        });

      this.arretsService
        .getArretsType(this.stringDateDebut, this.stringDateFin)
        .subscribe((response) => {
          // @ts-expect-error data
          this.sumArretsDepassements = response.data;
          //On boucle sur les four et on récupére la somme des arrêts pour chaque
          for (let i = 0; i < this.numbers.length; i++) {
            this.arretsService
              .getArretsSumFour(
                this.stringDateDebut,
                this.stringDateFin,
                this.numbers[i],
              )
              .subscribe((response) => {
                // @ts-expect-error data
                this.sumArretsDepassements.push(response.data[0]);
              });
          }
          this.arretsService
            .getArretsSum(this.stringDateDebut, this.stringDateFin)
            .subscribe((response) => {
              // @ts-expect-error data
              this.sumArretsDepassements.push(response.data[0]);
            });
        });
    } else {
      /**
       * Dépassements 1/2 heures
       */
      this.sumArretsDepassements = [];
      this.arretsService
        .getDepassements(this.stringDateDebut, this.stringDateFin)
        .subscribe((response) => {
          // @ts-expect-error data
          this.listArretsDepassements = response.data;
        });

      for (let i = 0; i < this.numbers.length; i++) {
        this.arretsService
          .getDepassementsSumFour(
            this.stringDateDebut,
            this.stringDateFin,
            this.numbers[i],
          )
          .subscribe((response) => {
            // @ts-expect-error data
            this.sumArretsDepassements.push(response.data[0]);
          });
      }
    }
  }

  setPeriod(form: NgForm) {
    if (
      (form.value["dateDeb"] != "" && form.value["dateFin"] != "") ||
      (this.dateFin != undefined && this.dateDeb != undefined)
    ) {
      if (
        form.value["dateDeb"].length < 1 &&
        form.value["dateFin"].length < 1
      ) {
        this.popupService.alertErrorForm("Période non valide !");
      } else {
        this.dateDeb = new Date(
          (document.getElementById("dateDeb") as HTMLInputElement).value,
        );
        this.dateFin = new Date(
          (document.getElementById("dateFin") as HTMLInputElement).value,
        );
        if (this.dateFin < this.dateDeb) {
          this.popupService.alertErrorForm(
            "La date de Fin est inférieure à la date de Départ !",
          );
        } else {
          const mmF = String(this.dateDeb.getMonth() + 1).padStart(2, "0"); //January is 0!
          const yyyyF = this.dateDeb.getFullYear();
          const ddF = String(this.dateDeb.getDate()).padStart(2, "0");
          this.stringDateDebut = yyyyF + "-" + mmF + "-" + ddF;
          const mmL = String(this.dateFin.getMonth() + 1).padStart(2, "0"); //January is 0!
          const yyyyL = this.dateFin.getFullYear();
          const ddL = String(this.dateFin.getDate()).padStart(2, "0");
          this.stringDateFin = yyyyL + "-" + mmL + "-" + ddL;
          this.ngOnInit();
        }
      }
    }
  }

  //changer les dates pour saisir le mois en cours
  setCurrentMonth(form: NgForm) {
    this.dateService.setCurrentMonth(form);
    this.setPeriod(form);
  }

  //changer les dates pour afficher le mois en dernier
  setLastMonth(form: NgForm) {
    const date = new Date();
    let mm: string;
    let yyyy: number;
    if (date.getMonth() === 0) {
      mm = "12";
      yyyy = date.getFullYear() - 1;
    } else {
      mm = String(date.getMonth()).padStart(2, "0"); //January is 0!
      yyyy = date.getFullYear();
    }
    const dd = String(new Date(yyyy, date.getMonth(), 0).getDate()).padStart(
      2,
      "0",
    );

    const Fisrtday = yyyy + "-" + mm + "-" + "01";
    const Lastday = yyyy + "-" + mm + "-" + dd;
    (document.getElementById("dateDeb") as HTMLInputElement).value = Fisrtday;
    (document.getElementById("dateFin") as HTMLInputElement).value = Lastday;
    form.value["dateDeb"] = Fisrtday;
    form.value["dateFin"] = Lastday;
    this.setPeriod(form);
  }

  //Suppression d'un arret
  delete(id: number) {
    this.updateAfterDelete = true;

    if (this.isArret == true) {
      this.arretsService.deleteArret(id).subscribe((response) => {
        if (response == "Suppression de l'arrêt OK") {
          this.popupService.alertSuccessForm("L'arrêt a bien été supprimé !");
          this.ngOnInit();
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors de la suppression de l'arrêt ....",
          );
        }
      });
    } else {
      /**
       * Dépassements 1/2 heures
       */
      this.arretsService.deleteDepassement(id).subscribe((response) => {
        if (response == "Suppression du DEP OK") {
          this.popupService.alertSuccessForm(
            "Le dépassement a bien été supprimé !",
          );
          this.ngOnInit();
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors de la suppression du dépassement ....",
          );
        }
      });
    }
  }
}
