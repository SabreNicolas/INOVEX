import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DatePipe, Location } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Actualite } from "src/models/actualite.model";
import { cahierQuartService } from "../services/cahierQuart.service";
import { PopupService } from "../services/popup.service";
import { rondierService } from "../services/rondier.service";
import { ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { AltairService } from "../services/altair.service";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

declare let $: any;

@Component({
  selector: "app-list-evenements",
  templateUrl: "./list-evenements.component.html",
  styleUrls: ["./list-evenements.component.scss"],
})
export class ListEvenementsComponent implements OnInit {
  @ViewChild("myCreateEventDialog") createEventDialog = {} as TemplateRef<any>;
  @ViewChild("myDTDialog") DTDialog = {} as TemplateRef<any>;

  public listEvenement: any[];
  public dateDebString: string;
  public dateFinString: string;
  public submitted: boolean;
  public idEvenement: number;
  public dialogRef = {};
  public titre: string;
  public importance: number;
  public dateDeb: Date | undefined;

  fileToUpload: File | undefined;
  public imgSrc!: any;

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

  public DI: string;
  public BT: string;
  public descriptionBT: string;
  public commentaireBT: string;
  public responsableBT: string;
  public statusBT: string;
  public planifieDebutBT: string;
  public planifieFinBT: string;

  public days: string[];
  public hideEvent: boolean;

  constructor(
    public altairService: AltairService,
    private rondierService: rondierService,
    private datePipe: DatePipe,
    public cahierQuartService: cahierQuartService,
    private dialog: MatDialog,
    private popupService: PopupService,
  ) {
    this.listEvenement = [];
    this.dateDebString = "";
    this.titre = "";
    this.importance = 0;
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

    this.DI = "";
    this.BT = "";
    this.descriptionBT = "";
    this.statusBT = "";
    this.planifieDebutBT = "";
    this.planifieFinBT = "";
    this.commentaireBT = "";
    this.responsableBT = "";

    this.days = [];

    this.hideEvent = true;
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

    this.cahierQuartService.getAllEvenement().subscribe((response) => {
      this.listEvenement = response.data;
    });

    this.titre = "";
    this.cause = "";
    this.groupementGMAO = "";
    this.equipementGMAO = "";
    this.description = "";
    this.importance = 0;
    this.dateDeb = undefined;
    this.imgSrc = "";
    this.demandeTravaux = 0;

    this.altairService.login().subscribe((response) => {
      this.token = response.token;

      this.altairService.getEquipements(this.token).subscribe((response) => {
        for (const equipment of response.equipment) {
          if (equipment.status != "REBUT") {
            this.listEquipementGMAO.push(equipment);
          }
        }
        this.listEquipementGMAOFiltre = this.listEquipementGMAO;
        //console.log(this.listEquipementGMAO);

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

  //suppression d'un évènement
  deleteEvenement(id: number) {
    Swal.fire({
      title: "Etes vous sûr de vouloir supprimer cet évènement ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.cahierQuartService.deleteEvenement(id).subscribe((response) => {
          if (response == "Suppression de l'evenement OK") {
            this.cahierQuartService
              .historiqueEvenementDelete(id)
              .subscribe((response) => {
                this.popupService.alertSuccessForm(
                  "L'evenement a bien été supprimé !",
                );
              });
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de la suppression de l'evenement....",
            );
          }
        });
        this.ngOnInit();
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La suppression a été annulée.");
      }
    });
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

  downloadImage(urlPhoto: string) {
    window.open(urlPhoto, "_blank");
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

  ouvrirDialogCreerEvent() {
    this.dialogRef = this.dialog.open(this.createEventDialog, {
      width: "60%",
      disableClose: true,
      autoFocus: true,
    });
    this.dialog.afterAllClosed.subscribe((response) => {
      this.idEvenement = 0;
      this.ngOnInit();
    });
  }

  ouvrirDialogModifEvent(id: number, dupliquer: number) {
    this.idEvenement = id;
    this.dialogRef = this.dialog.open(this.createEventDialog, {
      width: "40%",
      disableClose: true,
      autoFocus: true,
    });

    this.cahierQuartService
      .getOneEvenement(this.idEvenement)
      .subscribe((response) => {
        this.titre = response.data[0]["titre"];
        this.importance = response.data[0]["importance"];
        this.dateDeb = response.data[0]["date_heure_debut"]
          .replace(" ", "T")
          .replace("Z", "");
        this.dateFin = response.data[0]["date_heure_fin"]
          .replace(" ", "T")
          .replace("Z", "");
        this.groupementGMAO = response.data[0]["groupementGMAO"];
        this.equipementGMAO = response.data[0]["equipementGMAO"];
        this.demandeTravaux = response.data[0]["demande_travaux"];
        this.description = response.data[0]["description"];
        this.consigne = response.data[0]["consigne"];
        this.cause = response.data[0]["cause"];
        this.imgSrc = response.data[0]["url"];

        if (dupliquer == 1) {
          this.idEvenement = 0;
          $("#equipementGMAO").show();
          $("#groupementGMAO").show();

          this.groupementGMAO = "";
          this.equipementGMAO = "";
        } else {
          $("#demandeTravaux").hide();
          $("#demandeTravauxLabel").hide();
        }
      });

    this.dialog.afterAllClosed.subscribe((response) => {
      this.idEvenement = 0;
      this.ngOnInit();
    });
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
        "Veuillez renseigner le titre de l'évènement. La saisie a été annulée.",
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

    if (this.demandeTravaux != 0 && this.idEvenement == 0) {
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
        //Si on est en mode édition
        if (this.idEvenement != 0) {
          this.cahierQuartService
            .updateEvenement(
              this.titre,
              this.importance,
              //@ts-expect-error data
              dateDebString,
              dateFinString,
              this.groupementGMAO,
              this.equipementGMAO,
              this.cause,
              this.description,
              this.consigne,
              this.demandeTravaux,
              this.idEvenement,
            )
            .subscribe((response) => {
              if (response != undefined) {
                this.cahierQuartService
                  .historiqueEvenementUpdate(this.idEvenement)
                  .subscribe((response) => {
                    this.popupService.alertSuccessForm("Evènement modifiée !");
                    this.ngOnInit();
                    this.dialog.closeAll();
                  });
              }
            });
        }
        //Sinon on créé
        else {
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
                // console.log(response);
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
                      this.ngOnInit();
                      this.dialog.closeAll();
                    });
                }
              });
          }
        }
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La création a été annulée.");
      }
    });
  }

  getDI(id: string) {
    this.altairService.getOneDI(this.token, id).subscribe((response) => {
      this.DI = id;
      this.BT = response.fkcodeworkorder;
      const timeZone = "Europe/Paris";
      if (response.fkcodeworkorder != undefined) {
        this.altairService
          .getOneDT(this.token, this.BT)
          .subscribe((response) => {
            this.descriptionBT = response.description;
            this.responsableBT = response.fkcodelaborincharge;
            this.commentaireBT = response.wom1;
            //targstartdate
            if (response.eststartdate != undefined) {
              const dateDeb = parseISO(response.eststartdate);
              const zoneDateDeb = toZonedTime(dateDeb, timeZone);
              this.planifieDebutBT = format(zoneDateDeb, "dd/MM/yyyy HH:mm");
            }
            //targenddate
            if (response.estenddate != undefined) {
              const dateFin = parseISO(response.estenddate);
              const zoneDateFin = toZonedTime(dateFin, timeZone);
              this.planifieFinBT = format(zoneDateFin, "dd/MM/yyyy HH:mm");
            }
            this.statusBT = response.status;
            this.ouvrirDialogDT();
          });
      } else {
        this.popupService.alertSuccessForm(
          "Cette DI n'a pas été transformé en BT !",
        );
      }
    });
  }

  ouvrirDialogDT() {
    this.dialogRef = this.dialog.open(this.DTDialog, {
      width: "60%",
      disableClose: false,
      autoFocus: true,
    });
    this.dialog.afterAllClosed.subscribe((response) => {
      this.idEvenement = 0;
      this.DI = "";
      this.BT = "";
      this.ngOnInit();
    });
  }

  changeEventVisible() {
    this.hideEvent = !this.hideEvent;
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
