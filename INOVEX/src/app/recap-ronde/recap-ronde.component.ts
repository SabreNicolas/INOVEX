import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { cahierQuartService } from "../services/cahierQuart.service";
import { ActivatedRoute, Router } from "@angular/router";
import { addDays, format } from "date-fns";
import { rondierService } from "../services/rondier.service";
import { zone } from "src/models/zone.model";
import Swal from "sweetalert2";
import { PopupService } from "../services/popup.service";
import { AltairService } from "../services/altair.service";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { Actualite } from "src/models/actualite.model";
declare let $: any;

@Component({
  selector: "app-recap-ronde",
  templateUrl: "./recap-ronde.component.html",
  styleUrls: ["./recap-ronde.component.scss"],
})
export class RecapRondeComponent implements OnInit {
  @ViewChild("myCreateEventDialog") createEventDialog = {} as TemplateRef<any>;

  //TODO : on a encore un bug d'affichage => quand on appui rapidement sur hier et un quart => duplication des éléments
  //Un délai entre 2 exécutions du même bouton est sécurisé par un coll down de 3 sec

  public listAction: any[];
  public listActionsEnregistrees: any[];
  public listEvenement: any[];
  public listZone: any[];
  public listZoneOfUsine: zone[];
  public listZoneSelection: any[];
  public consignes: any[];
  public dateDebString: string;
  public dateFinString: string;
  public dateDebStringToShow: string;
  public dateFinStringToShow: string;
  public quart: number;
  public nomAction: string;
  public idEquipe: number;
  public listAnomalie: any[];

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
  public demandeTravaux: boolean;
  public consigne: number;
  public description: string;
  public cause: string;
  public quartLibelle: string;
  public saisieAutorise: boolean;
  public nomEquipe: string;
  public listRondier: any[];
  public userPrecedent: string;
  public listActu: Actualite[];
  public hideEquipe: boolean;
  public idAnomalie: number;

  constructor(
    public altairService: AltairService,
    private route: ActivatedRoute,
    private rondierService: rondierService,
    private datePipe: DatePipe,
    public cahierQuartService: cahierQuartService,
    private dialog: MatDialog,
    private popupService: PopupService,
    private router: Router,
  ) {
    this.listAction = [];
    this.listActionsEnregistrees = [];
    this.listZoneOfUsine = [];
    this.listZoneSelection = [];
    this.listZone = [];
    this.listEvenement = [];
    this.consignes = [];
    this.dateDebString = "";
    this.dateFinString = "";
    this.dateDebStringToShow = "";
    this.dateFinStringToShow = "";
    this.quart = 0;
    this.nomAction = "";
    this.idEquipe = 0;
    this.listAnomalie = [];

    this.dateDebString = "";
    this.titre = "";
    this.importance = 0;
    this.dateFinString = "";
    this.idEvenement = 0;
    this.submitted = false;
    this.token = "";
    this.demandeTravaux = false;
    this.consigne = 0;
    this.description = "";
    this.groupementGMAO = "";
    this.listGroupementsGMAOMap = new Map();
    this.listGroupementGMAOTable = [];
    this.listEquipementGMAOFiltre = [];
    this.listEquipementGMAO = [];
    this.equipementGMAO = "";
    this.cause = "";
    this.quartLibelle = "";
    this.saisieAutorise = false;
    this.nomEquipe = "";
    this.listRondier = [];
    this.userPrecedent = "";
    this.listActu = [];
    this.hideEquipe = true;
    this.idAnomalie = 0;

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

    this.route.queryParams.subscribe((params) => {
      if (params.quart != undefined) {
        this.quart = params.quart;
      } else {
        this.quart = 0;
      }
    });
  }

  ngOnInit(): void {
    this.idAnomalie = 0;
    //Récupération de l'heure actuelle pour vérifier si on a le droit d'ajouter des actions et autre (on ne peut plus le faire sur un quart terminé)
    const heure = new Date().getHours();

    //permet de laiiser une marge pour saisir sur le quart
    const margeHeure = 2;

    //Récupération de la date de début et de la date de fin en fonction du quart
    if (this.quart == 1) {
      this.dateDebString = format(new Date(), "yyyy-MM-dd") + " 05:00:00.000";
      this.dateDebStringToShow = format(new Date(), "dd/MM/yyyy") + " 05:00";
      this.dateFinString = format(new Date(), "yyyy-MM-dd") + " 13:00:00.000";
      this.dateFinStringToShow = format(new Date(), "dd/MM/yyyy") + " 13:00";
      this.quartLibelle = "MATIN";
      if (heure >= 5 && heure < 13 + margeHeure) {
        this.saisieAutorise = true;
      }
    } else if (this.quart == 2) {
      this.dateDebString = format(new Date(), "yyyy-MM-dd") + " 13:00:00.000";
      this.dateDebStringToShow = format(new Date(), "dd/MM/yyyy") + " 13:00";
      this.dateFinString = format(new Date(), "yyyy-MM-dd") + " 21:00:00.000";
      this.dateFinStringToShow = format(new Date(), "dd/MM/yyyy") + " 21:00";
      this.quartLibelle = "APRES-MIDI";
      if (heure >= 13 && heure < 21 + margeHeure) {
        this.saisieAutorise = true;
      }
    } else if (this.quart == 3) {
      if (heure < 5 + margeHeure) {
        this.dateDebString =
          format(addDays(new Date(), -1), "yyyy-MM-dd") + " 21:00:00.000";
        this.dateDebStringToShow =
          format(addDays(new Date(), -1), "dd/MM/yyyy") + " 21:00";
        this.dateFinString = format(new Date(), "yyyy-MM-dd") + " 05:00:00.000";
        this.dateFinStringToShow = format(new Date(), "dd/MM/yyyy") + " 05:00";
        this.quartLibelle = "NUIT";
      } else {
        this.dateDebString = format(new Date(), "yyyy-MM-dd") + " 21:00:00.000";
        this.dateDebStringToShow = format(new Date(), "dd/MM/yyyy") + " 21:00";
        this.dateFinString =
          format(addDays(new Date(), 1), "yyyy-MM-dd") + " 05:00:00.000";
        this.dateFinStringToShow =
          format(addDays(new Date(), 1), "dd/MM/yyyy") + " 05:00";
        this.quartLibelle = "NUIT";
      }
      if (heure >= 21 || heure < 5 + margeHeure) {
        this.saisieAutorise = true;
      }
    }

    //Récupération des action pour la ronde en cours
    this.cahierQuartService
      .getActionsRonde(this.dateDebString, this.dateFinString)
      .subscribe((response) => {
        this.listAction = response.data;
        // mettre en place un décodage pour ne plus avoir espace en format %20
        for (let i = 0; i < this.listAction.length; i++) {
          this.listAction[i].nom = decodeURI(this.listAction[i].nom);
        }
      });

    //Récupération des évènement pour la ronde en cours
    this.cahierQuartService
      .getEvenementsRonde(this.dateDebString, this.dateFinString)
      .subscribe((response) => {
        this.listEvenement = response.data;
      });

    //Récupération des anomalies pour la ronde en cours
    this.rondierService
      .getAnomaliesOfOneDay(
        this.dateDebStringToShow.substring(0, 10),
        this.quart,
      )
      .subscribe((response) => {
        //@ts-expect-error data
        this.listAnomalie = response.data;
      });

    //Récupération des zones pour la ronde en cours
    this.cahierQuartService
      .getZonesCalendrierRonde(this.dateDebString, this.dateFinString)
      .subscribe((response) => {
        this.listZone = response.BadgeAndElementsOfZone;
      });

    this.cahierQuartService.getActionsEnregistrement().subscribe((response) => {
      //@ts-expect-error data
      this.listActionsEnregistrees = response.data;
    });
    //Récupération de l'id de l'équipe pour la ronde si l'équipe est déjà crée
    // this.cahierQuartService.getEquipeQuart(this.quart,format(new Date(),'yyyy-MM-dd')).subscribe((response)=>{
    //   // @ts-expect-error data
    //   this.idEquipe = response.data[0].id;
    // });

    //Récupération des zones de l'usine pour l'ajout d'une zone
    this.rondierService.listZone().subscribe((response) => {
      // @ts-expect-error data
      this.listZoneOfUsine = response.data;
    });

    //On récupére la liste des consignes en cours de validité
    this.rondierService
      .listConsignesEntreDeuxDates(
        this.dateDebString.substring(0, 16),
        this.dateFinString.substring(0, 16),
      )
      .subscribe((response) => {
        //@ts-expect-error data
        this.consignes = response.data;
      });

    //On récupère la liste des actus actives sur le quart
    this.cahierQuartService.getActusQuart(1).subscribe((response) => {
      this.listActu = response.data;
    });

    //Récupération de l'id de l'équipe pour la ronde si l'équipe est déjà crée
    this.cahierQuartService
      .getEquipeQuart(
        this.quart,
        format(new Date(this.dateDebString), "yyyy-MM-dd"),
      )
      .subscribe((response) => {
        this.listRondier = [];
        this.idEquipe = response.data[0].id;
        //Si on est en mode édition
        if (this.idEquipe > 0) {
          //On récupère l'équipe concernée
          this.cahierQuartService
            .getOneEquipe(this.idEquipe)
            .subscribe((response) => {
              this.nomEquipe = response.data[0]["equipe"];
              //TODO voir si on ne peut pas simplement affecter la variable avec un = et la reponse de l'API
              if (response.data[0]["idRondier"] != null) {
                for (let i = 0; i < response.data.length; i++) {
                  //console.log(response.data[i]);
                  this.listRondier[i] = {
                    IdEquipe: response.data[i]["id"],
                    Id: response.data[i]["idRondier"],
                    Prenom: response.data[i]["prenomRondier"],
                    Nom: response.data[i]["nomRondier"],
                    Poste: response.data[i]["poste"],
                    Zone: response.data[i]["zone"],
                    heure_deb: response.data[i]["heure_deb"],
                    heure_fin: response.data[i]["heure_fin"],
                    heure_tp: response.data[i]["heure_tp"],
                    comm_tp: response.data[i]["comm_tp"],
                  };
                  if (response.data[i]["poste"] == "Chef de Quart") {
                    this.userPrecedent =
                      response.data[i]["prenomRondier"] +
                      " " +
                      response.data[i]["nomRondier"];
                  }
                }
              }
            });
        }
      });
  }

  //Fonction qui permet d'afficher la création d'une zone
  newZone() {
    $("#divCreationZone").show();
    $("#hideZone").show();
    $("#createZone").hide();
  }

  //Fonction qui permet de cacher la création d'une zone
  hideZone() {
    $("#divCreationZone").hide();
    $("#hideZone").hide();
    $("#createZone").show();
  }

  //Focntion qui permet d'ajouter la zone au calendrier
  createZone() {
    for (const zone of this.listZoneSelection) {
      this.cahierQuartService
        .newCalendrierZone(
          zone,
          this.dateDebString,
          this.quart,
          this.dateFinString,
          null,
        )
        .subscribe(() => {
          this.ngOnInit();
        });
    }
  }

  //Fonction qui permet d'afficher la création d'une action
  newAction() {
    $("#divCreationAction").show();
    $("#hideAction").show();
    $("#createAction").hide();
  }

  //Fonction qui permet de cacher la création d'une action
  hideAction() {
    $("#divCreationAction").hide();
    $("#hideAction").hide();
    $("#createAction").show();
  }

  //Focntion qui permet d'ajouter l'action au calendrier et à la tablea d'actions
  createAction() {
    //Récupération de l'heure à l'instant T pour concaténer avec le texte de l'action
    const now = format(new Date(), "HH:mm");
    Swal.fire({
      title: "Veuillez saisir l'heure de réalisation",
      input: "time",
      inputValue: now,
      showCancelButton: true,
      confirmButtonText: "Valider",
      confirmButtonColor: "green",
      cancelButtonText: "Annuler",
      cancelButtonColor: "red",
      allowOutsideClick: true,
    }).then((result) => {
      if (result.value != undefined) {
        this.cahierQuartService
          .newAction(
            result.value + " " + this.nomAction,
            this.dateDebString,
            this.dateFinString,
          )
          .subscribe((response) => {
            this.cahierQuartService
              .newCalendrierAction(
                response.data[0].id,
                response.data[0].date_heure_debut,
                this.quart,
                response.data[0].date_heure_fin,
                1,
                null,
              )
              .subscribe(() => {
                //réinitialiser le champ de saisie
                this.nomAction = "";
                this.ngOnInit();
              });
          });
      }
    });
  }

  //supprimer une zone
  deleteZone(id: any) {
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
        this.cahierQuartService.deleteCalendrier(id).subscribe((response) => {
          if (response == "Suppression de l'evenement du calendrier OK") {
            this.popupService.alertSuccessForm(
              "L'évènement a bien été supprimé !",
            );
            this.ngOnInit();
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de la suppression de l'évènement....",
            );
          }
        });
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La suppression a été annulée.");
      }
    });
  }

  //supprimer une action
  deleteAction(id: any) {
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
        this.cahierQuartService.deleteCalendrier(id).subscribe((response) => {
          if (response == "Suppression de l'evenement du calendrier OK") {
            this.popupService.alertSuccessForm(
              "L'évènement a bien été supprimé !",
            );
            this.ngOnInit();
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de la suppression de l'évènement....",
            );
          }
        });
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La suppression a été annulée.");
      }
    });
  }

  //mettre à jour le statut terminé d'une action une action
  updateAction(id: any, termine: boolean) {
    this.cahierQuartService
      .updateTerminerCalendrier(id, termine)
      .subscribe((response) => {
        if (response == "Update action du calendrier OK") {
          this.popupService.alertSuccessForm("Mise à jour OK !");
          this.ngOnInit();
        } else {
          this.popupService.alertErrorForm("Erreur lors de la mise à jour....");
        }
      });
  }

  priseDeQuart() {
    //Demande de confirmation de création d'équipe
    Swal.fire({
      title: "Avez vous pris connaissance des consignes ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        this.cahierQuartService.historiquePriseQuart().subscribe(() => {
          // window.location.href =
          //   "https://fr-couvinove300.prod.paprec.fr:8100/cahierQuart/recapRondePrecedente?quart=" +
          //   this.quart +
          //   "&idEquipe=" +
          //   this.idEquipe;
          this.router.navigate(["/cahierQuart/recapRondePrecedente"], {
            queryParams: { quart: this.quart, idEquipe: this.idEquipe },
          });
        });
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertSuccessForm("La prise de quart a été annulée.");
      }
    });
  }

  editEquipe() {
    //Demande de confirmation de modification d'équipe
    Swal.fire({
      title: "Voulez-vous modifier l'équipe ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        this.cahierQuartService.historiquePriseQuart().subscribe(() => {
          this.router.navigate(["/cahierQuart/newEquipe"], {
            queryParams: { idEquipe: this.idEquipe },
          });
        });
      } else {
        // Pop-up d'annulation de la modification
        this.popupService.alertSuccessForm("La modification a été annulée.");
      }
    });
  }

  downloadFile(consigne: string) {
    window.open(consigne, "_blank");
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

    if (this.demandeTravaux != false) {
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
          .subscribe(() => {});
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
          .subscribe(() => {});
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
                  .subscribe(() => {
                    this.popupService.alertSuccessForm("Evènement modifiée !");
                    this.ngOnInit();
                    this.dialog.closeAll();
                  });
              }
            });
        }
        //Sinon on créé
        else {
          if (this.demandeTravaux != false) {
            //TODO : récupérer le userGMAO du user
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
                      this.cahierQuartService
                        .historiqueEvenementCreate(this.idEvenement)
                        .subscribe(() => {
                          if (this.idAnomalie > 0) {
                            this.rondierService
                              .updateAnomalieSetEvenement(this.idAnomalie)
                              .subscribe((response) => {});
                          }
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
                0,
              )
              .subscribe((response) => {
                if (response != undefined) {
                  this.popupService.alertSuccessForm("Nouvel évènement créée");
                  this.idEvenement = response["data"][0]["Id"];
                  this.cahierQuartService
                    .historiqueEvenementCreate(this.idEvenement)
                    .subscribe(() => {
                      if (this.idAnomalie > 0) {
                        this.rondierService
                          .updateAnomalieSetEvenement(this.idAnomalie)
                          .subscribe((response) => {});
                      }
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
      reader.onload = () => (this.imgSrc = reader.result);
      reader.readAsDataURL(file);
    } else this.popupService.alertErrorForm("Aucun fichier choisi....");
  }

  clickDemandeTravaux() {
    if ($("input#demandeTravaux").is(":checked")) {
      this.demandeTravaux = true;
      $("#dateFin").show();
      $("#equipementGMAO").show();
      $("#groupementGMAO").show();
      this.getNow();
    } else {
      this.demandeTravaux = false;
      $("#dateFin").hide();
      $("#equipementGMAO").hide();
      $("#groupementGMAO").hide();
    }
  }

  //L'id est optionnel
  ouvrirDialogCreerEvent(id?: number) {
    this.dialogRef = this.dialog.open(this.createEventDialog, {
      width: "60%",
      disableClose: true,
      autoFocus: true,
    });
    this.getNow();
    if (id != undefined) {
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
          this.addImgaeToInput(this.imgSrc, input);
        }
      });
    }
    this.dialog.afterAllClosed.subscribe(() => {
      this.idEvenement = 0;
      this.ngOnInit();
      this.dateDebString = "";
      this.titre = "";
      this.importance = 0;
      this.dateFinString = "";
      this.idEvenement = 0;
      this.submitted = false;
      this.token = "";
      this.demandeTravaux = false;
      this.consigne = 0;
      this.description = "";
      this.groupementGMAO = "";
      this.listGroupementsGMAOMap = new Map();
      this.listGroupementGMAOTable = [];
      this.listEquipementGMAOFiltre = [];
      this.listEquipementGMAO = [];
      this.equipementGMAO = "";
      this.cause = "";
      this.idAnomalie = 0;
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

  splitDescription(descr: string) {
    return descr.split("\n");
  }

  finQuart() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    this.router.navigate(["/"]);
  }

  changeEquipeVisible() {
    this.hideEquipe = !this.hideEquipe;
  }

  //Permet de choisir une action depuis une ligne pré-défini
  choixAction() {
    const listActionsEnregistrees = {};
    for (let i = 0; i < this.listActionsEnregistrees.length; i++) {
      //@ts-expect-error data
      listActionsEnregistrees[this.listActionsEnregistrees[i]["nom"]] =
        this.listActionsEnregistrees[i]["nom"];
    }

    Swal.fire({
      title: "Veuillez choisir une action",
      input: "select",
      inputOptions: listActionsEnregistrees,
      showCancelButton: true,
      confirmButtonText: "Valider",
      allowOutsideClick: true,
    }).then((result) => {
      if (result.value != undefined) {
        this.nomAction = String(result.value);
      }
    });
  }

  //permet de mettre à jour les heures de l'équipe
  updateInfos(
    idEquipe: number,
    idRondier: number,
    typeInfo: string,
    valueInfo: string,
  ) {
    let type = "time";
    if (typeInfo == "comm_tp") type = "text";
    //@ts-expect-error data
    Swal.fire({
      title: "Veuillez saisir une valeur",
      input: type,
      inputValue: valueInfo,
      showCancelButton: true,
      confirmButtonText: "Valider",
      confirmButtonColor: "green",
      cancelButtonText: "Annuler",
      cancelButtonColor: "red",
      allowOutsideClick: true,
    }).then((result) => {
      if (result.value != undefined) {
        this.cahierQuartService
          .updateInfosAffectationEquipe(
            idRondier,
            idEquipe,
            typeInfo,
            result.value,
          )
          .subscribe((response) => {
            if (response == "Ajout ok") {
              this.popupService.alertSuccessForm(
                "Infos mises à jour avec succès !",
              );
            } else {
              this.popupService.alertErrorForm(
                "Erreur lors de la mise à jour des infos ....",
              );
            }
          });
        this.ngOnInit();
      }
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

    this.dialog.afterAllClosed.subscribe(() => {
      this.idEvenement = 0;
      this.ngOnInit();
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
              .subscribe(() => {
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

  getNow() {
    //mise par défaut la date de début à l'instant T
    const date = new Date();
    const yyyy = date.getFullYear();
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const day = yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + min;
    (document.getElementById("dateDebut") as HTMLInputElement).value = day;
    //@ts-ignore
    this.dateDeb = day;
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
}
