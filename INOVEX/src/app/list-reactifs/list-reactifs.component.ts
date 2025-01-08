import { Component, OnInit } from "@angular/core";
import { productsService } from "../services/products.service";
import { categoriesService } from "../services/categories.service";
import Swal from "sweetalert2";
import { product } from "../../models/products.model";
import { NgForm } from "@angular/forms";
import { moralEntitiesService } from "../services/moralentities.service";
import { dateService } from "../services/date.service";
//Librairie pour lire les csv importés
import { Papa } from "ngx-papaparse";
import { importCSV } from "src/models/importCSV.model";
import { user } from "src/models/user.model";
import { idUsineService } from "../services/idUsine.service";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-list-reactifs",
  templateUrl: "./list-reactifs.component.html",
  styleUrls: ["./list-reactifs.component.scss"],
})
export class ListReactifsComponent implements OnInit {
  public userLogged!: user;
  public idUsine: number;
  public listProducts: product[];
  public dateDeb: Date | undefined;
  public dateFin: Date | undefined;
  public listDays: string[];
  public typeImportTonnage: string;
  public csvArray: importCSV[];
  public stockageImport: Map<string, number>;
  public correspondance: any[];
  public dates: string[];
  public dechetsManquants: Map<string, string>;

  constructor(
    private idUsineService: idUsineService,
    private popupService: PopupService,
    private moralEntitiesService: moralEntitiesService,
    private productsService: productsService,
    private categoriesService: categoriesService,
    private Papa: Papa,
    private mrService: moralEntitiesService,
    private dateService: dateService,
  ) {
    this.listProducts = [];
    this.listDays = [];
    this.typeImportTonnage = "";
    this.csvArray = [];
    this.stockageImport = new Map();
    this.dechetsManquants = new Map();
    this.correspondance = [];
    this.idUsine = 0;
    this.dates = [];
  }

  ngOnInit(): void {
    this.idUsine = this.idUsineService.getIdUsine();

    this.mrService.GetImportTonnage().subscribe((response) => {
      //@ts-expect-error data
      this.typeImportTonnage = response.data[0].typeImport;
    });

    this.getCorrespondance();

    this.productsService.getReactifs().subscribe((response) => {
      // @ts-expect-error data
      this.listProducts = response.data;
      this.getValues();
    });
  }

  setPeriod(form: NgForm) {
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
    this.listDays = this.dateService.getDays(this.dateDeb, this.dateFin);
    this.getValues();
  }

  //récupérer les tonnages en BDD
  getValues() {
    this.listDays.forEach((date) => {
      this.listProducts.forEach((pr) => {
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
            if (response.data[0] != undefined && response.data[0].Value != 0) {
              (
                document.getElementById(pr.Id + "-" + date) as HTMLInputElement
              ).value = response.data[0].Value;
            } else
              (
                document.getElementById(pr.Id + "-" + date) as HTMLInputElement
              ).value = "";
          });
      });
    });
  }

  //valider les saisies
  validation() {
    this.listDays.forEach((date) => {
      this.listProducts.forEach((pr) => {
        const value = (
          document.getElementById(pr.Id + "-" + date) as HTMLInputElement
        ).value.replace(",", ".");
        const Value2 = value.replace(" ", "");
        const valueInt: number = +Value2;
        if (valueInt > 0.0) {
          this.mrService
            .createMeasure(
              date.substr(6, 4) +
                "-" +
                date.substr(3, 2) +
                "-" +
                date.substr(0, 2),
              valueInt,
              pr.Id,
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

  //changer les dates pour saisir hier
  setYesterday(form: NgForm) {
    this.dateService.setYesterday(form);
    this.setPeriod(form);
    //this.dateService.resetForm(form);
  }

  //changer les dates pour saisir la semaine en cours
  setCurrentWeek(form: NgForm) {
    this.dateService.setCurrentWeek(form);
    this.setPeriod(form);
    // this.dateService.resetForm(form);
  }

  //changer les dates pour saisir le mois en cours
  setCurrentMonth(form: NgForm) {
    this.dateService.setCurrentMonth(form);
    this.setPeriod(form);
    // this.dateService.resetForm(form);
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

  /**
   * IMPORT CSV
   */

  //import tonnage via fichier
  import(event: Event) {
    //Pithiviers/chinon/dunkerque
    if (this.typeImportTonnage.toLowerCase().includes("ademi")) {
      //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
      //Dunkerque
      if (this.idUsine === 9) {
        this.lectureCSV(event, ";", true, 11, 0, 37);
      } else this.lectureCSV(event, ";", false, 7, 2, 5);
    }
    //Noyelles-sous-lens et Thiverval
    else if (this.typeImportTonnage.toLowerCase().includes("protruck")) {
      //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
      //Thiverval
      if (this.idUsine === 11) {
        this.lectureCSV(event, ";", true, 29, 14, 16, 1);
      } else if (this.idUsine === 1) {
        //this.lectureCSV(event, ";", true, 39, 2, 24, 1);
        this.lectureCSV(event, ";", true, 31, 2, 16, 1);
      } else this.lectureCSV(event, ";", false, 31, 2, 16);
    }
    //Saint-Saulve
    else if (this.typeImportTonnage.toLowerCase().includes("minebea")) {
      //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
      this.lectureCSV(event, ";", false, 20, 7, 19, 26);
    }
    //Calce
    else if (
      this.typeImportTonnage.toLowerCase().includes("informatique verte")
    ) {
      //@ts-expect-error data
      let file = event.target.files[0].name;
      file = file.toLowerCase();
      if (file.includes("dasri")) {
        //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
        this.lectureCSV(event, ";", true, 9999, 3, 7);
      } else {
        //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
        this.lectureCSV(event, ";", true, 15, 8, 6, 12);
      }
    }
    //Maubeuge
    else if (this.typeImportTonnage.toLowerCase().includes("tradim")) {
      //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
      this.lectureCSV(event, ";", true, 6, 0, 5, 11);
    }
    //Plouharnel / GIEN
    else if (this.typeImportTonnage.toLowerCase().includes("arpege masterk")) {
      //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
      //Gien
      if (this.idUsine === 16) {
        this.lectureCSV(event, ";", false, 17, 14, 7);
      }
      //Douchy
      else if (this.idUsine === 10) {
        this.lectureCSV(event, ";", true, 27, 16, 7);
      }
      //Mourenx
      else if (this.idUsine === 18) {
        this.lectureCSV(event, ";", false, 13, 1, 7);
      } else this.lectureCSV(event, ";", false, 6, 1, 11, 12);
    }
    //Pluzunet
    else if (this.typeImportTonnage.toLowerCase().includes("caktus")) {
      //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
      this.lectureCSV(event, ",", true, 27, 14, 10, 11);
    }
    //Sète, CERGY
    else if (this.typeImportTonnage.toLowerCase().includes("hodja")) {
      //Sète
      //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
      if (this.idUsine === 19) {
        this.lectureCSV(event, ";", true, 11, 0, 14);
      }
      //Cergy
      else {
        this.lectureCSV(event, ",", true, 12, 0, 14);
      }
    }
    //Vitré
    else if (this.typeImportTonnage.toLowerCase().includes("pcs précia")) {
      //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
      if (this.idUsine === 15) {
        //Vitré
        this.lectureCSV(event, ";", true, 20, 4, 27, 31);
      } else if (this.idUsine === 26) {
        //PONTEX
        this.lectureCSV(event, ";", true, 19, 11, 6, 3);
      }
      //Villefranche
      else {
        this.lectureCSV(event, ";", true, 19, 6, 11, 2);
      }
    }
    //Saint Ouen
    else if (this.typeImportTonnage.toLowerCase().includes("syspeau")) {
      //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
      this.lectureCSV(event, ";", true, 18, 5, 9, 4);
    }
    //Saint-barth
    else if (this.typeImportTonnage.toLowerCase().includes("quantum")) {
      //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
      this.lectureCSV(event, ";", true, 3, 0, 6, 1);
    }
    //Bourg en Bresse
    else if (this.typeImportTonnage.toLowerCase().includes("adepro")) {
      //delimiter,header,typedechet,dateEntree,tonnage, posEntreeSortie
      this.lectureCSV(event, ";", true, 3, 5, 9, 4);
    }
  }

  //import tonnage via fichier
  //Traitement du fichier csv ADEMI
  lectureCSV(
    event: Event,
    delimiter: string,
    header: boolean,
    posTypeDechet: number,
    posDateEntree: number,
    posTonnage: number,
    posEntreeSortie?: number,
  ) {
    this.loading();
    //@ts-expect-error data
    const files = event.target.files; // FileList object
    const file = files[0];
    const reader = new FileReader();

    let debut = 0;

    //Si on a une ligne header, on commence l'acquisition à 1.
    if (header == true) {
      debut = 1;
    }

    reader.readAsText(file);
    reader.onload = (event: any) => {
      const csv = event.target.result; // Content of CSV file
      //options à ajouter => pas d'entête, delimiter ;
      this.Papa.parse(csv, {
        skipEmptyLines: true,
        delimiter: delimiter,
        //False pour éviter de devoir utiliser le nom des entêtes et rester sur un tableau avec des indices.
        header: false,
        complete: async (results) => {
          for (let i = debut; i < results.data.length; i++) {
            //ON récupére les lignes infos nécessaires pour chaque ligne du csv
            //ON récupère uniquement les types de déchets pour les entrants
            //Création de l'objet qui contient l'ensemble des infos nécessaires

            //permet de diviser le tonnage par 1000 si on l'a en kg
            let divisionKgToTonnes = 1;
            //si ce n'est pas caktus on divise par 1000 pour avoir en tonnes
            if (
              !this.typeImportTonnage.toLowerCase().includes("caktus") &&
              !this.typeImportTonnage.toLowerCase().includes("tradim")
            ) {
              divisionKgToTonnes = 1000;
            }

            //Si la velur de position de sens n'est pas fournit, on le met à S
            var EntreeSortie;
            if (posEntreeSortie == undefined) {
              EntreeSortie = "E";
            } else {
              EntreeSortie = results.data[i][posEntreeSortie];
            }

            //Permet d'éviter l'erreur en cas de lignes vides
            if (results.data[i][posDateEntree] != undefined) {
              if (results.data[i][posDateEntree] != "") {
                //On ajoute toutes les dates dans le tableau dates
                this.dates.push(
                  results.data[i][posDateEntree].substring(0, 10),
                );
              }

              const importCSV = {
                client: "Aucun",
                typeDechet: results.data[i][posTypeDechet],
                dateEntree: results.data[i][posDateEntree].substring(0, 10),
                tonnage: Math.abs(
                  results.data[i][posTonnage]
                    .replace(/[^0-9,.]/g, "")
                    .replace(",", ".") / divisionKgToTonnes,
                ),
                entrant: EntreeSortie,
              };
              this.csvArray.push(importCSV);
            }
          }

          //Fonction qui tranforme les dates string au format date afin de les comparer
          function compareDates(a: string, b: string) {
            const dateA = new Date(a.split("/").reverse().join("/"));
            const dateB = new Date(b.split("/").reverse().join("/"));
            return dateA.getTime() - dateB.getTime();
          }

          //On trie le tableau des dates
          this.dates.sort(compareDates);

          //On récupère la date de début qui est donc la première date du tableau et on la met au format 'yyyy-mm-dd'
          const [day, month, year] = this.dates[0].split("/");
          const dateDeDebut = `${year}-${month}-${day}`;

          //On récupère la date de fin qui est donc la dernière date du tableau et on la met au format 'yyyy-mm-dd'
          const [day2, month2, year2] =
            this.dates[this.dates.length - 1].split("/");
          const dateDeFin = `${year2}-${month2}-${day2}`;

          //On supprime les valeurs entre les deux dates, pour tout les déchets présents dans le csv
          this.correspondance.forEach((correspondance) => {
            this.moralEntitiesService
              .deleteMesuresReactifsEntreDeuxDates(
                dateDeDebut,
                dateDeFin,
                correspondance.productImport,
              )
              .subscribe((response) => {
                this.insertTonnageCSV();
              });
          });

          this.removeloading();
        },
      });
    };
  }

  getCorrespondance() {
    this.mrService.getCorrespondancesReactifs().subscribe((response) => {
      // console.log(response)
      // @ts-expect-error data
      this.correspondance = response.data;
    });
  }

  loading() {
    var element = document.getElementById("spinner");
    // @ts-expect-error data
    element.classList.add("loader");
    var element = document.getElementById("spinnerBloc");
    // @ts-expect-error data
    element.classList.add("loaderBloc");
  }

  removeloading() {
    var element = document.getElementById("spinner");
    // @ts-expect-error data
    element.classList.remove("loader");
    var element = document.getElementById("spinnerBloc");
    // @ts-expect-error data
    element.classList.remove("loaderBloc");
  }

  //Insertion du tonnage récupéré depuis le fichier csv ADEMI
  insertTonnageCSV() {
    let successInsert = true;
    this.stockageImport.clear();
    let count = 0;

    this.csvArray.forEach((csv) => {
      csv.typeDechet = csv.typeDechet.toLowerCase().replace(/\s/g, "");
      const dechetManquant = csv.typeDechet;
      count = 0;

      this.correspondance.forEach((correspondance) => {
        correspondance.productImport = correspondance.productImport
          .toLowerCase()
          .replace(/\s/g, "");

        if (
          csv.entrant.toLowerCase() == "e" ||
          csv.entrant == 1 ||
          csv.entrant.toLowerCase() == "réception" ||
          csv.entrant.toLowerCase() == "reception" ||
          csv.entrant.toLowerCase().includes("entree") ||
          csv.entrant.toLowerCase() == "entrée" ||
          csv.entrant.toLowerCase() == "entrant" ||
          csv.entrant.toLowerCase() == "incinerables" ||
          csv.entrant.toLowerCase() == "consommables"
        ) {
          //Si il y a correspondance on fait traitement
          if (correspondance.productImport == csv.typeDechet) {
            const formatDate =
              csv.dateEntree.split("/")[2] +
              "-" +
              csv.dateEntree.split("/")[1] +
              "-" +
              csv.dateEntree.split("/")[0];
            if (formatDate != "undefined-undefined-") {
              const keyHash = formatDate + "_" + correspondance.ProductId;
              //si il y a deja une valeur dans la hashMap pour ce client et ce jour, on incrémente la valeur
              let value, valueRound;
              count = count + 1;
              if (this.stockageImport.has(keyHash)) {
                //@ts-expect-error data
                value = this.stockageImport.get(keyHash) + csv.tonnage;
                valueRound = parseFloat(value.toFixed(3));
                this.stockageImport.set(keyHash, valueRound);
              } else
                //Sinon on insére dans la hashMap
                this.stockageImport.set(
                  keyHash,
                  parseFloat(csv.tonnage.toFixed(3)),
                );
            }
          }
        }
      });

      //Si sur ce dechet, nous n'avons pas trouvé de correspondant, count = 0, et que ce dechet est une sortie, on la'jouter au tableau des dechet
      if (
        count == 0 &&
        (csv.entrant.toLowerCase() == "e" ||
          csv.entrant == 1 ||
          csv.entrant.toLowerCase() == "réception" ||
          csv.entrant.toLowerCase() == "reception" ||
          csv.entrant.toLowerCase().includes("entree") ||
          csv.entrant.toLowerCase() == "entrée" ||
          csv.entrant.toLowerCase() == "entrant" ||
          csv.entrant.toLowerCase() == "incinerables")
      ) {
        this.dechetsManquants.set(dechetManquant, dechetManquant);
      }
    });

    //on parcours la hashmap pour insertion en BDD
    this.stockageImport.forEach(async (value: number, key: string) => {
      this.mrService
        .createMeasure(key.split("_")[0], value, parseInt(key.split("_")[1]), 0)
        .subscribe((response) => {
          if (response != "Création du Measures OK") {
            successInsert = false;
          }
        });
    });

    if (successInsert == true) {
      let afficher = "";

      this.dechetsManquants.forEach(async (value: string, key: string) => {
        afficher +=
          "Le déchet : <strong>'" +
          key +
          "'</strong> n'a pas de correspondance dans CAP Exploitation <br>";
      });
      afficher +=
        "<strong>Pensez à faire la correspondance dans l'administration !</strong>";
      Swal.fire({
        html: afficher,
        width: "80%",
        title: "Les valeurs ont été insérées avec succès !",
      });
    } else {
      this.popupService.alertErrorForm(
        "Erreur lors de l'insertion des valeurs ....",
      );
    }
    if (this.stockageImport.size == 0) {
      this.popupService.alertErrorForm(
        "Aucune valeur n'a été insérée, aucune correspondance n'a été trouvée",
      );
    }
  }
}
