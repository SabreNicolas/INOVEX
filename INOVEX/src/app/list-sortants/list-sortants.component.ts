import { Component, OnInit } from "@angular/core";
import { productsService } from "../services/products.service";
import { categoriesService } from "../services/categories.service";
import { category } from "src/models/categories.model";
import Swal from "sweetalert2";
import { product } from "../../models/products.model";
import { NgForm } from "@angular/forms";
import { moralEntitiesService } from "../services/moralentities.service";
import { dateService } from "../services/date.service";
//Librairie pour lire les csv importés
import { Papa } from "ngx-papaparse";
import { dechetsCollecteurs } from "src/models/dechetsCollecteurs.model";
import { importCSV } from "src/models/importCSV.model";
import { user } from "src/models/user.model";
import { idUsineService } from "../services/idUsine.service";
import { valueHodja } from "src/models/valueHodja.model";
import { DatePipe } from "@angular/common";
import * as XLSX from "xlsx";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-list-sortants",
  templateUrl: "./list-sortants.component.html",
  styleUrls: ["./list-sortants.component.scss"],
})
export class ListSortantsComponent implements OnInit {
  public userLogged!: user;
  public idUsine: number;
  public listProducts: product[];
  public listCategories: category[];
  public debCode: string;
  public dateDeb: Date | undefined;
  public dateFin: Date | undefined;
  public listDays: string[];
  public typeImportTonnage: string;
  public csvArray: importCSV[];
  public stockageImport: Map<string, number>;
  public correspondance: any[];
  //stockage données HODJA à envoyer
  public stockageHodja: Map<string, number>;
  public dechetsManquants: Map<string, string>;
  public valuesHodja: valueHodja[];
  public dates: string[];

  constructor(
    private idUsineService: idUsineService,
    private popupService: PopupService,
    private datePipe: DatePipe,
    private moralEntitiesService: moralEntitiesService,
    private productsService: productsService,
    private categoriesService: categoriesService,
    private Papa: Papa,
    private mrService: moralEntitiesService,
    private dateService: dateService,
  ) {
    this.debCode = "";
    this.listProducts = [];
    this.listDays = [];
    this.listCategories = [];
    this.typeImportTonnage = "";
    this.csvArray = [];
    this.stockageImport = new Map();
    this.dechetsManquants = new Map();
    this.correspondance = [];
    this.idUsine = 0;
    this.stockageHodja = new Map();
    this.valuesHodja = [];
    this.dates = [];
  }

  ngOnInit(): void {
    this.idUsine = this.idUsineService.getIdUsine();

    this.categoriesService.getCategoriesSortants().subscribe((response) => {
      // @ts-ignore
      this.listCategories = response.data;
    });

    this.mrService.GetImportTonnage().subscribe((response) => {
      //@ts-ignore
      this.typeImportTonnage = response.data[0].typeImport;
    });

    this.getCorrespondance();

    this.productsService.getSortants(this.debCode).subscribe((response) => {
      // @ts-ignore
      this.listProducts = response.data;
      this.getValues();
    });
  }

  setFilters() {
    const codeCat = document.getElementById("categorie");
    // @ts-ignore
    const codeCatSel = codeCat.options[codeCat.selectedIndex].value;
    this.debCode = codeCatSel;
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
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
        this.lectureCSV(event, ";", false, 29, 14, 16, 1);
      } else if (this.idUsine === 1) {
        //this.lectureCSV(event, ";", true, 39, 2, 24, 1);
        this.lectureCSV(event, ";", true, 31, 2, 16, 1);
      } else this.lectureCSV(event, ";", true, 31, 2, 16);
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
      //@ts-ignore
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
    //@ts-ignore
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
              EntreeSortie = "S";
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
                  +results.data[i][posTonnage]
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
              .deleteMesuresSortantsEntreDeuxDates(
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
    this.mrService.getCorrespondanceSortants().subscribe((response) => {
      // console.log(response)
      // @ts-ignore
      this.correspondance = response.data;
    });
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

  //Insertion du tonnage récupéré depuis le fichier csv
  insertTonnageCSV() {
    let successInsert = true;
    this.debCode = "20";
    this.stockageImport.clear();
    let count = 0;

    this.csvArray.forEach((csv) => {
      const dechetManquant = csv.typeDechet;
      count = 0;

      this.correspondance.forEach((correspondance) => {
        csv.typeDechet = csv.typeDechet.toLowerCase().replace(/\s/g, "");
        correspondance.productImport = correspondance.productImport
          .toLowerCase()
          .replace(/\s/g, "");

        if (
          csv.entrant.toLowerCase() == "s" ||
          csv.entrant.toLowerCase() == "expédition" ||
          csv.entrant == 2 ||
          csv.entrant.toLowerCase() == "expedition" ||
          csv.entrant.toLowerCase() == "sortie" ||
          csv.entrant.toLowerCase() == "sortant" ||
          csv.entrant.toLowerCase() == "sous produits" ||
          csv.entrant.toLowerCase() == "recyclables"
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
                //@ts-ignore
                value = this.stockageImport.get(keyHash) + csv.tonnage;
                valueRound = parseFloat(value.toFixed(3));
                this.stockageImport.set(keyHash, valueRound);
              } else
                //Sinon on insére dans la hashMap
                //@ts-ignore
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
        (csv.entrant.toLowerCase() == "s" ||
          csv.entrant.toLowerCase() == "expédition" ||
          csv.entrant == 2 ||
          csv.entrant.toLowerCase() == "expedition" ||
          csv.entrant.toLowerCase() == "sortie" ||
          csv.entrant.toLowerCase() == "sortant" ||
          csv.entrant.toLowerCase() == "sous produits" ||
          csv.entrant.toLowerCase() == "recyclables")
      ) {
        this.dechetsManquants.set(dechetManquant, dechetManquant);
      }
    });
    //debug
    //console.log(this.stockageImport);
    //on parcours la hashmap pour insertion en BDD
    this.stockageImport.forEach(async (value: number, key: string) => {
      await this.mrService
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

  //Fonction pour attendre
  wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  //Export de la table dans fichier EXCEL
  exportRegistreDNDTSExcel() {
    if (
      (document.getElementById("dateDeb") as HTMLInputElement).value != "" &&
      (document.getElementById("dateFin") as HTMLInputElement).value != ""
    ) {
      this.dateDeb = new Date(
        (document.getElementById("dateDeb") as HTMLInputElement).value,
      );
      this.dateFin = new Date(
        (document.getElementById("dateFin") as HTMLInputElement).value,
      );

      const dateDebString = this.datePipe.transform(this.dateDeb, "yyyy-MM-dd");
      const dateFinString = this.datePipe.transform(this.dateFin, "yyyy-MM-dd");

      const nomFichier =
        "dnd-sortant du " +
        this.datePipe.transform(this.dateDeb, "dd-MM-yyyy") +
        " au " +
        this.datePipe.transform(this.dateFin, "dd-MM-yyyy");
      console.log(nomFichier);
      console.log(dateDebString);
      this.moralEntitiesService
        .getRegistreDNDTSSortants(dateDebString, dateFinString)
        .subscribe((response) => {
          /* table id is passed over here */
          const element = response.data;
          if (response.data.length > 1) {
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element); //Attention les jours sont considérés comme mois !!!!

            /* generate workbook and add the worksheet */
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Entrants");

            // /* save to file */
            XLSX.writeFile(wb, nomFichier + ".xlsx");
          } else {
            this.popupService.alertErrorForm("Aucune donnée sur ces dates !");
          }
        });
    } else {
      this.popupService.alertErrorForm("Veuillez entrer des dates");
    }
  }

  //Import tonnage via HODJA
  recupHodja(form: NgForm) {
    let successInsert = true;
    this.stockageHodja.clear();
    let dateDebFormat = new Date(),
      dateFinFormat = new Date();
    let listDate = [];
    let count = 0;
    const dechetsManquants: string[] = [];

    dateDebFormat = new Date(form.value["dateDeb"]);
    dateFinFormat = new Date(form.value["dateFin"]);

    listDate = this.dateService.getDays(dateDebFormat, dateFinFormat);
    listDate.forEach(async (day) => {
      await this.wait(100);
      //On récupère dans hodja les valeurs de bascule pour la période choisit
      this.moralEntitiesService
        .recupHodjaSortants(day, day)
        .subscribe(async (response) => {
          this.stockageHodja.clear();
          this.valuesHodja = response;

          //ON boucle sur les valeurs HODJA
          for await (const valueHodja of this.valuesHodja) {
            const dechetManquant = valueHodja.typeDechet;
            count = 0;

            //ET les clients INOVEX
            for (const correspondance of this.correspondance) {
              valueHodja.typeDechet = valueHodja.typeDechet
                .toLowerCase()
                .replace(/\s/g, "");
              correspondance.productImport = correspondance.productImport
                .toLowerCase()
                .replace(/\s/g, "");

              //Si il y a correspondance on fait traitement
              if (correspondance.productImport == valueHodja.typeDechet) {
                const formatDate = valueHodja.entryDate.split("T")[0];
                const keyHash = formatDate + "_" + correspondance.ProductId;
                let value, valueRound;
                count = count + 1;

                //si il y a deja une valeur dans la hashMap pour ce client et ce jour, on incrémente la valeur
                if (this.stockageHodja.has(keyHash)) {
                  value =
                    //@ts-ignore
                    this.stockageHodja.get(keyHash) +
                    (valueHodja.TK_Poids_brut - valueHodja.TK_Poids_tare) /
                      1000;
                  valueRound = parseFloat(value.toFixed(3));
                  this.stockageHodja.set(keyHash, valueRound);
                } else
                  //Sinon on insére dans la hashMap
                  //@ts-ignore
                  this.stockageHodja.set(
                    keyHash,
                    parseFloat(
                      (
                        (valueHodja.TK_Poids_brut - valueHodja.TK_Poids_tare) /
                        1000
                      ).toFixed(3),
                    ),
                  );
              }
            }
            if (count == 0) {
              dechetsManquants.push(dechetManquant);
            }
          }

          //On parcours la HashMap pour insérer en BDD
          this.stockageHodja.forEach(async (value: number, key: string) => {
            await this.mrService
              .createMeasure(
                key.split("_")[0],
                value,
                parseInt(key.split("_")[1]),
                0,
              )
              .subscribe((response) => {
                if (response != "Création du Measures OK") {
                  successInsert = false;
                }
              });
          });

          if (successInsert == true) {
            let afficher = "";

            for (let i = 0; i < dechetsManquants.length; i++) {
              afficher +=
                "Le déchet : <strong>'" +
                dechetsManquants[i] +
                "'</strong> n'a pas de correspondance dans CAP Exploitation <br>";
            }
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
          await this.wait(350);
        });
    });
  }
}
