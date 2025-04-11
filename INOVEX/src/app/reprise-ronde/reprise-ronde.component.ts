import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { rondierService } from "../services/rondier.service";
import { format } from "date-fns";
import { PopupService } from "../services/popup.service";
import {
  RepriseRonde,
  NameValuePair,
  ResultatsFormulaires,
  element,
  Zone,
} from "src/models/repriseRonde.model";

@Component({
  selector: "app-reprise-ronde",
  templateUrl: "./reprise-ronde.component.html",
  styleUrl: "./reprise-ronde.component.scss",
})
export class RepriseRondeComponent implements OnInit {
  public id: number;
  public repriseRonde: RepriseRonde = {
    Id: 0,
    date: "",
    quart: 0,
    termine: false,
  };
  public date = "";
  public quart = 0;
  public zones: Zone[] = [];
  selectedValues: Record<string, string> = {};

  public resultatsFormulaires: ResultatsFormulaires = {
    values: [], // Initialisation de la clé "values" avec un tableau vide
  };

  //si compteur l'index est au moins égal
  //Régulateur
  //Valeur par défaut si pas égal popup
  //curseur hors champs
  valeursCurseur: Record<number, number> = {};

  constructor(
    private rondierService: rondierService,
    private route: ActivatedRoute,
    private router: Router,
    private popupService: PopupService,
  ) {
    this.id = 0;

    this.route.queryParams.subscribe((params) => {
      if (params.id != undefined) {
        this.id = params.id;
      } else {
        this.id = 0;
      }
    });
  }

  ngOnInit(): void {
    this.rondierService.getOneRepriseRonde(this.id).subscribe((ronde) => {
      // @ts-expect-error data
      this.repriseRonde = ronde["data"][0];
      console.log(this.repriseRonde);

      let heure = "00";
      if (this.repriseRonde.quart === 1) {
        heure = "05";
      } else if (this.repriseRonde.quart === 2) {
        heure = "13";
      } else if (this.repriseRonde.quart === 3) {
        heure = "21";
      }
      this.date =
        typeof this.repriseRonde.date === "string"
          ? this.repriseRonde.date
          : this.repriseRonde.date.toISOString();
      this.quart = this.repriseRonde.quart;
      this.repriseRonde.date = format(this.repriseRonde.date, "yyyy-dd-MM");
      this.repriseRonde.date = this.repriseRonde.date + " " + heure + ":00:00";

      this.rondierService
        .getZonesCalendrierRonde(this.repriseRonde.date)
        .subscribe((zones) => {
          // @ts-expect-error BadgeAndElementsOfZone
          this.zones = zones.BadgeAndElementsOfZone;
          this.initResultatsFormulaires();
          if (this.zones.length === 0) {
            this.rondierService.listZonesAndElements().subscribe((zones) => {
              // @ts-expect-error BadgeAndElementsOfZone
              this.zones = zones.BadgeAndElementsOfZone;
              this.initResultatsFormulaires();
            });
          }
        });
    });
  }

  initResultatsFormulaires() {
    const valuesArray: { nameValuePairs: NameValuePair }[] = [];

    // Initialisation de resultatsFormulaires avec tous les éléments des zones
    this.zones.forEach((zone) => {
      zone.elements.forEach((element: element) => {
        this.valeursCurseur[element.Id] = Number(0);
        this.selectedValues[element.Id] = element.defaultValue;

        const nameValuePairs = {
          value: element.defaultValue ? element.defaultValue : "/",
          modeRegulateur: "undefined",
          elementId: element.Id,
          rondeId: 0,
        };

        // Ajouter l'élément dans valuesArray
        const updatedValue = {
          nameValuePairs: nameValuePairs,
        };

        valuesArray.push(updatedValue);
      });
    });

    // Encadrer le tableau resultatsFormulaires avec la clé "values"
    this.resultatsFormulaires = {
      values: valuesArray,
    };

    console.log("Valeurs des formulaires :", this.resultatsFormulaires); // Affiche les valeurs des formulaires dans la console
  }
  // Fonction pour mettre à jour la valeur
  mettreAJourValeur(
    rondeId: number,
    elementId: number,
    target: EventTarget | null,
    isRegulateur: boolean,
  ) {
    const value = (target as HTMLInputElement).value;
    console.log("Valeur entrée :", value);
    this.valeursCurseur[elementId] = Number(value);

    // Cherche si l'élément avec le même elementId existe déjà dans la liste
    const existingElement = this.resultatsFormulaires.values.find(
      (item) => item.nameValuePairs.elementId === elementId,
    );

    if (existingElement) {
      // Si l'élément existe déjà, on met à jour sa valeur
      if (
        isRegulateur &&
        (value === "Automatique" || value === "Manuel" || value === "Distance")
      )
        existingElement.nameValuePairs.modeRegulateur = value;
      else existingElement.nameValuePairs.value = value;
    } else {
      let updatedValue = {
        nameValuePairs: {
          value: "/",
          modeRegulateur: "undefined",
          elementId: elementId,
          rondeId: 0,
        },
      };
      // Sinon, on ajoute un nouvel élément à la liste
      if (
        isRegulateur &&
        (value === "Automatique" || value === "Manuel" || value === "Distance")
      ) {
        updatedValue = {
          nameValuePairs: {
            value: "/",
            modeRegulateur: value,
            elementId: elementId,
            rondeId: 0,
          },
        };
      } else {
        updatedValue = {
          nameValuePairs: {
            value: value,
            modeRegulateur: "undefined",
            elementId: elementId,
            rondeId: 0,
          },
        };
      }

      this.resultatsFormulaires.values.push(updatedValue);
    }

    // Affiche les résultats mis à jour
    console.log("Résultats des formulaires :", this.resultatsFormulaires);
  }

  envoyerDonnees() {
    console.log("Données à envoyer :", this.resultatsFormulaires); // Affiche les données à envoyer
    this.rondierService
      .postRonde(this.date, this.quart)
      .subscribe((response) => {
        console.log(response); // Affiche la réponse du serveur
        const rondeId = response.data[0]["Id"];

        this.resultatsFormulaires.values.forEach((item) => {
          // Met à jour le rondeId pour chaque élément
          item.nameValuePairs.rondeId = rondeId;
        });

        this.rondierService
          .postMesuresRondier(this.resultatsFormulaires)
          .subscribe((response) => {
            console.log("Réponse du serveur :", response); // Affiche la réponse du serveur
            this.rondierService.closeRonde(rondeId).subscribe((response) => {
              console.log("Ronde fermée :", response); // Affiche la réponse du serveur
              this.rondierService
                .deleteRepriseRonde(this.id)
                .subscribe((response) => {
                  console.log("Ronde supprimée :", response); // Affiche la réponse du serveur
                  this.popupService.alertSuccessForm(
                    "Ronde reprise avec succès !",
                  );
                  this.router.navigate(["/reporting"]);
                });
            });
          });
      });
  }
}
