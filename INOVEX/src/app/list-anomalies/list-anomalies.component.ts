import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import { anomalie } from "src/models/anomalie.model";
import { rondierService } from "../services/rondier.service";
import { PopupService } from "../services/popup.service";
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
import { AltairService } from "../services/altair.service";
import { cahierQuartService } from "../services/cahierQuart.service";
declare let $: any;

@Component({
  selector: "app-list-anomalies",
  templateUrl: "./list-anomalies.component.html",
  styleUrls: ["./list-anomalies.component.scss"],
})
export class ListAnomaliesComponent implements OnInit {
  @ViewChild("myCreateEventDialog") createEventDialog = {} as TemplateRef<any>;

  public listAnomalies: any[];
  public dialogRef = {};
  public dateDebString: string;
  public dateFinString: string;
  public submitted: boolean;
  public idEvenement: number;
  public titre: string;
  public importance: number;
  public dateDeb: Date | undefined;

  fileToUpload: File | undefined;
  public imgSrc!: any;
  public idAnomalie: number;
  public groupementGMAO: string;
  public equipementGMAO: string;
  public listGroupementsGMAOMap: Map<string, string>;
  public listGroupementGMAOTable: any[];
  public listEquipementGMAO: any[];
  public listEquipementGMAOFiltre: any[];
  private token: string;
  public dateFin: Date | undefined;
  public demandeTravaux: number;
  public consigne: number;
  public description: string;
  public cause: string;
  public days: string[];

  constructor(
    public altairService: AltairService,
    public cahierQuartService: cahierQuartService,
    private rondierService: rondierService,
    private popupService: PopupService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
  ) {
    this.listAnomalies = [];
    this.dateDebString = "";
    this.titre = "";
    this.importance = 0;
    this.idAnomalie = 0;
    this.dateFinString = "";
    this.idEvenement = 0;
    this.submitted = false;
    this.token = "";
    this.demandeTravaux = 0;
    this.consigne = 0;
    this.description = "";
    this.groupementGMAO = "";
    this.listGroupementsGMAOMap = new Map();
    this.listGroupementGMAOTable = [];
    this.listEquipementGMAOFiltre = [];
    this.listEquipementGMAO = [];
    this.equipementGMAO = "";
    this.cause = "";
    this.days = [];
  }

  ngOnInit(): void {
    /**Détermination des dates des 7 jours */
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    this.days = this.getDates(sevenDaysAgo, today);
    this.days.reverse();
    //permet d'avoir une boucle de plus pour tout afficher
    this.days.push("");
    //Par défaut on masque l'ensemble des tableaux
    $(document).ready(() => {
      this.days.forEach((day) => {
        //alert('#table--'+day.substring(0,2));
        $("#table--" + day.substring(0, 2)).hide();
      });
      //Par défaut on affiche quand même le premier élément qui correspond au jour J
      $("#table--" + this.days[0].substring(0, 2)).show();
    });
    /**FIN Détermination de la date de il y a 7 jours */

    this.rondierService.getAllAnomalies().subscribe((response) => {
      // @ts-expect-error data
      this.listAnomalies = response.data;
    });

    this.dateDebString = "";
    this.titre = "";
    this.importance = 0;
    this.idAnomalie = 0;
    this.dateFinString = "";
    this.idEvenement = 0;
    this.submitted = false;
    this.token = "";
    this.demandeTravaux = 0;
    this.consigne = 0;
    this.description = "";
    this.groupementGMAO = "";
    this.listGroupementsGMAOMap = new Map();
    this.listGroupementGMAOTable = [];
    this.listEquipementGMAOFiltre = [];
    this.listEquipementGMAO = [];
    this.equipementGMAO = "";
    this.cause = "";

    this.altairService.login().subscribe((response) => {
      this.token = response.token;

      this.altairService.getEquipements(this.token).subscribe((response) => {
        for (const equipment of response.equipment) {
          if (equipment.status != "REBUT") {
            this.listEquipementGMAO.push(equipment);
          }
        }
        this.listEquipementGMAOFiltre = this.listEquipementGMAO;

        //On récupère la liste des groupements avec les détails
        this.altairService.getLocations(this.token).subscribe((response) => {
          for (const equipement of this.listEquipementGMAO) {
            for (const location of response.location) {
              if (equipement.fkcodelocation === location.codelocation) {
                this.listGroupementsGMAOMap.set(
                  equipement.fkcodelocation + "---" + location.description,
                  equipement.fkcodelocation + "---" + location.description,
                );
              }
            }
          }
          this.listGroupementGMAOTable = Array.from(
            this.listGroupementsGMAOMap.keys(),
          );
        });
      });
    });
  }

  downloadImage(urlPhoto: string) {
    window.open(urlPhoto, "_blank");
  }

  ouvrirDialogCreerEvent(id: number) {
    this.dialogRef = this.dialog.open(this.createEventDialog, {
      width: "60%",
      disableClose: true,
      autoFocus: true,
    });
    this.idAnomalie = id;
    this.rondierService.getOneAnomalie(id).subscribe((response) => {
      // console.log(response);
      //@ts-expect-error data
      this.description = response.data[0]["commentaire"];
      //@ts-expect-error data
      this.imgSrc = response.data[0]["photo"];

      const input = document.getElementById("fichier") as HTMLInputElement;
      // console.log(this.imgSrc);
      if (
        this.imgSrc != "NULL" &&
        this.imgSrc != null &&
        this.imgSrc != undefined &&
        this.imgSrc != ""
      ) {
        // console.log("ici");
        this.addImgaeToInput(this.imgSrc, input);
      }
    });

    this.dialog.afterAllClosed.subscribe((response) => {
      this.idAnomalie = 0;
      this.ngOnInit();
    });
  }

  //Method déclenché dès que le fichier sélectionné change
  //Stockage du fichier chaque fois qu'un fichier est upload
  saveFile(event: Event) {
    //Récupération du fichier dans l'input
    // @ts-expect-error data
    this.fileToUpload = (event.target as HTMLInputElement).files[0];
    //console.log((<HTMLInputElement>event.target).files[0]);

    // @ts-expect-error data
    if (event.target.value) {
      // @ts-expect-error data
      const file = event.target.files[0];
      this.fileToUpload = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.imgSrc = reader.result);
      reader.readAsDataURL(file);
    } else this.popupService.alertErrorForm("Aucun fichier choisi....");
  }

  clickDemandeTravaux() {
    if ($("input#demandeTravaux").is(":checked")) {
      $("#dateFin").show();
      $("#equipementGMAO").show();
      $("#groupementGMAO").show();
      const date = new Date();
      const yyyy = date.getFullYear();
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
      const hh = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      const day = yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + min;
      (document.getElementById("dateDebut") as HTMLInputElement).value = day;
      //@ts-expect-error data
      this.dateDeb = day;
    } else {
      $("#dateFin").hide();
      $("#equipementGMAO").hide();
      $("#groupementGMAO").hide();
    }
  }

  updateElements() {
    this.listEquipementGMAOFiltre = [];

    if (this.groupementGMAO == "") {
      this.listEquipementGMAOFiltre = this.listEquipementGMAO;
    } else {
      for (const equipement of this.listEquipementGMAO) {
        if (equipement.fkcodelocation == this.groupementGMAO) {
          this.listEquipementGMAOFiltre.push(equipement);
        }
      }
    }
  }

  updateGroupements() {
    for (const equipement of this.listEquipementGMAO) {
      if (equipement.codeequipment == this.equipementGMAO.split("---")[0]) {
        this.groupementGMAO = equipement.fkcodelocation;
      }
    }
  }

  //Création ou édition d'un évènement
  newEvenement() {
    this.dateFin = this.dateDeb;
    //Il faut avoir renseigné une date de début
    if (this.dateDeb != undefined) {
      var dateDebString = this.datePipe.transform(
        this.dateDeb,
        "yyyy-MM-dd HH:mm",
      );
    } else {
      this.popupService.alertErrorForm(
        "Veuillez choisir une date de début. La saisie a été annulée.",
      );
      return;
    }
    //Il faut avoir renseigné une date de fin
    if (this.dateFin != undefined) {
      var dateFinString = this.datePipe.transform(
        this.dateFin,
        "yyyy-MM-dd HH:mm",
      );
    } else {
      this.popupService.alertErrorForm(
        "Veuillez choisir une date de Fin. La saisie a été annulée.",
      );
      return;
    }
    //Il faut avoir renseigné un nom
    if (this.titre == "") {
      this.popupService.alertErrorForm(
        "Veuillez renseigner le titre de l'actualité. La saisie a été annulée.",
      );
      return;
    }
    //Il faut que les deux dates soient cohérentes
    if (this.dateFin < this.dateDeb) {
      this.popupService.alertErrorForm(
        "Les dates ne correspondent pas. La saisie a été annulée.",
      );
      return;
    }

    if (this.demandeTravaux != 0) {
      // console.log(this.equipementGMAO);
      if (this.equipementGMAO == "") {
        this.popupService.alertErrorForm(
          "Veuillez choisir un équipement pour la DI",
        );
        return;
      }
    }
    //Si on la case consigne est cochée on la crée
    if (this.consigne) {
      this.consigne = 1;
      if (this.fileToUpload != undefined) {
        this.rondierService
          .createConsigne(
            this.titre,
            this.description,
            5,
            dateFinString,
            dateDebString,
            this.fileToUpload,
          )
          .subscribe((response) => {});
      } else {
        this.rondierService
          .createConsigne(
            this.titre,
            this.description,
            5,
            dateFinString,
            dateDebString,
            null,
          )
          .subscribe((response) => {});
      }
    } else this.consigne = 0;
    //Choix de la phrase à afficher en fonction du mode
    if (this.idEvenement > 0) {
      var question = "Êtes-vous sûr(e) de modifier cet évènement ?";
    } else var question = "Êtes-vous sûr(e) de créer cet évènement ?";
    //Demande de confirmation de l'évènement
    Swal.fire({
      title: question,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, créer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.demandeTravaux != 0) {
          //TODO
          this.altairService
            .createDI(
              this.token,
              this.titre,
              this.groupementGMAO,
              this.equipementGMAO.split("---")[0],
              this.cause,
              this.importance,
              this.description,
            )
            .subscribe((response) => {
              this.cahierQuartService
                .newEvenement(
                  this.titre,
                  //@ts-expect-error data
                  this.fileToUpload,
                  this.importance,
                  dateDebString,
                  dateFinString,
                  this.groupementGMAO,
                  this.equipementGMAO,
                  this.cause,
                  this.description,
                  this.consigne,
                  response.codeworkrequest,
                )
                .subscribe((response) => {
                  if (response != undefined) {
                    this.popupService.alertSuccessForm(
                      "Nouvel évènement créée",
                    );
                    this.idEvenement = response["data"][0]["Id"];
                    this.rondierService
                      .updateAnomalieSetEvenement(this.idAnomalie)
                      .subscribe((response) => {});
                    this.cahierQuartService
                      .historiqueEvenementCreate(this.idEvenement)
                      .subscribe((response) => {
                        this.ngOnInit();
                        this.dialog.closeAll();
                      });
                  }
                });
            });
        } else {
          this.cahierQuartService
            .newEvenement(
              this.titre,
              //@ts-expect-error data
              this.fileToUpload,
              this.importance,
              dateDebString,
              dateFinString,
              this.groupementGMAO,
              this.equipementGMAO,
              this.cause,
              this.description,
              this.consigne,
              this.demandeTravaux,
            )
            .subscribe((response) => {
              if (response != undefined) {
                this.popupService.alertSuccessForm("Nouvel évènement créée");
                this.idEvenement = response["data"][0]["Id"];
                this.cahierQuartService
                  .historiqueEvenementCreate(this.idEvenement)
                  .subscribe((response) => {
                    this.rondierService
                      .updateAnomalieSetEvenement(this.idAnomalie)
                      .subscribe((response) => {});
                    this.ngOnInit();
                    this.dialog.closeAll();
                  });
              }
            });
        }
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La création a été annulée.");
      }
    });
  }

  async addImgaeToInput(url: string, element: HTMLInputElement) {
    const reponse = await fetch(url);
    const blob = await reponse.blob();
    const fileName = url.split("/").pop() || "file.jpg";

    const file = new File([blob], fileName, { type: blob.type });

    const dataTranfer = new DataTransfer();
    dataTranfer.items.add(file);

    element.files = dataTranfer.files;
    this.fileToUpload = element.files[0];
  }

  //TODO a externaliser dans un service
  //Permet de récupérer les dates entre 2 dates, tableau au format string dd/mm/yyyy
  getDates(startDate: Date, stopDate: Date) {
    const dateArray = [];
    while (startDate <= stopDate) {
      dateArray.push(startDate.toLocaleDateString());
      startDate.setDate(startDate.getDate() + 1);
    }
    return dateArray;
  }

  //Permet d'afficher ou masquer les tableaux d'évènements
  showTable(dateTable: string) {
    const idTable = "#table--" + dateTable;
    if ($(idTable).is(":hidden")) {
      $(idTable).show();
    } else $(idTable).hide();
  }
}
