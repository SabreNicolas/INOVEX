import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
} from "@angular/core";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  parseISO,
  format,
  addWeeks,
  addMonths,
} from "date-fns";
import { Subject } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  DAYS_OF_WEEK,
} from "angular-calendar";
import { cahierQuartService } from "../services/cahierQuart.service";
import { DatePipe } from "@angular/common";
import { rondierService } from "../services/rondier.service";
import { zone } from "src/models/zone.model";
import Swal from "sweetalert2";
import { delay } from "rxjs/operators";
import { PopupService } from "../services/popup.service";
import { MatDialog } from "@angular/material/dialog";
import { user } from "src/models/user.model";
declare let $: any;

@Component({
  selector: "app-calendrier",
  templateUrl: "./calendrier.component.html",
  styleUrls: ["./calendrier.component.scss"],
})
export class CalendrierComponent implements OnInit {
  @ViewChild("modalContent", { static: true }) modalContent:
    | TemplateRef<any>
    | undefined;
  @ViewChild("myCreateEventDialog") createEventDialog = {} as TemplateRef<any>;
  @ViewChild("myReccurenceDialog") createReccurenceDialog =
    {} as TemplateRef<any>;

  public userLogged!: user;
  public view: CalendarView = CalendarView.Week;
  public listZone: zone[];
  public listZoneSelection: number[];
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();
  public modalData:
    | {
        nom: string;
        event: CalendarEvent;
        dateDeb: any;
        dateFin: any;
        ronde: any;
        isAction: boolean | undefined;
      }
    | undefined;
  public refresh = new Subject<any>();
  public events: CalendarEvent[];
  public colors: any;
  public weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  public weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];
  public activeDayIsOpen = true;
  public dateDeb!: any;
  public periodicite: number;
  public quart: number[];
  public occurences: number;
  public nomAction: string;
  public radioSelect: string;
  public dialogRef = {};
  public tabAction: any[];
  //Périodicité
  public listeJours: string[];
  public jours: string[];
  public periodeReccurence: string;
  public dateFin!: any;
  public repeterChaque: number;
  public setRepetition: boolean;
  public occurenceMois: number;
  public jourMois: string;
  public numeroJour: number;
  public radioMois: string;
  public today: Date = new Date();

  constructor(
    private modal: NgbModal,
    private dialog: MatDialog,
    private popupService: PopupService,
    private rondierService: rondierService,
    public cahierQuartService: cahierQuartService,
    private datePipe: DatePipe,
  ) {
    this.listeJours = [];
    this.tabAction = [];
    this.jours = [
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
      "dimanche",
    ];
    this.periodeReccurence = "semaine";
    this.repeterChaque = 1;
    this.setRepetition = false;
    this.occurenceMois = 0;
    this.jourMois = "";
    this.numeroJour = 0;
    this.radioMois = "occurenceMois";

    this.events = [];
    this.nomAction = "";
    this.radioSelect = "";
    this.listZone = [];
    this.listZoneSelection = [];
    this.periodicite = 0;
    this.quart = [];
    this.occurences = 10;
    this.colors = {
      red: {
        primary: "#ad2121",
        secondary: "#FAE3E3",
        secondaryText: "black",
      },
      blue: {
        primary: "#1e90ff",
        secondary: "#D1E8FF",
        secondaryText: "black",
      },
      yellow: {
        primary: "#e3bc08",
        secondary: "#FDF1BA",
        secondaryText: "black",
      },
      green: {
        primary: "#01D758",
        secondary: "#87E990",
        secondaryText: "black",
      },
    };
  }

  ngOnInit(): void {
    //On récupère le user dans le localStorage pour bloquer la suppresion dans le calendrier pour les super admin
    const userLogged = localStorage.getItem("user");
    if (typeof userLogged === "string") {
      const userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;
    }

    this.cahierQuartService.getActionsEnregistrement().subscribe((response) => {
      //@ts-expect-error data
      this.tabAction = response.data;
    });

    //On cache les blocs de création
    $("#CreationRondeAction").hide();
    $("#CreationRonde").hide();
    $("#CreationAction").hide();

    this.listZone = [];
    this.listZoneSelection = [];
    this.dateDeb = undefined;
    this.periodicite = 0;
    this.nomAction = "";

    //On vide le tableau d'évènement
    this.events = [];

    //On récupère les zones du calendrier
    this.cahierQuartService.getAllZonesCalendrier().subscribe((response) => {
      //On parcours les zones pour les ajouter une par une dans le tableau d'évènement
      let tabRondes: any[] = [];
      tabRondes.push(response.data[0]);
      for (let i = 1; i < response.data.length; i++) {
        const event = response.data[i];
        const eventP = response.data[i - 1];
        if (eventP.date_heure_debut.split("T")[1] == "05:00:00.000Z") {
          var color = "#71C1F9";
          var texte = "Quart du matin";
        } else if (eventP.date_heure_debut.split("T")[1] == "13:00:00.000Z") {
          var color = "#73FF97";
          var texte = "Quart de l'après-midi";
        } else {
          var color = "#F1FF6A";
          var texte = "Quart de nuit";
        }

        if (eventP.date_heure_debut == event.date_heure_debut) {
          tabRondes.push(event);
        } else {
          this.events.push({
            start: new Date(
              eventP.date_heure_debut.split("-")[0],
              eventP.date_heure_debut.split("-")[1] - 1,
              eventP.date_heure_debut.split("-")[2].split("T")[0],
              eventP.date_heure_debut.split("-")[2].split("T")[1].split(":")[0],
              0,
              0,
            ),
            end: new Date(
              eventP.date_heure_fin.split("-")[0],
              eventP.date_heure_fin.split("-")[1] - 1,
              eventP.date_heure_fin.split("-")[2].split("T")[0],
              eventP.date_heure_fin.split("-")[2].split("T")[1].split(":")[0],
              0,
              0,
            ),
            title: texte,
            allDay: false,
            color: {
              primary: color,
              secondary: color,
              secondaryText: "black",
            },
            id: event.id,
            ronde: tabRondes,
          });
          tabRondes = [];
          tabRondes.push(event);
        }
      }
      this.setView(CalendarView.Day);
      // this.setView(CalendarView.Week)
    });

    //On récupère les actions du calendrier
    this.cahierQuartService.getAllActionsCalendrier().subscribe((response) => {
      //On parcours les actions pour les ajouter une par une dans le tableau d'évènement
      for (const event of response.data) {
        if (event.date_heure_debut.split("T")[1] == "05:00:00.000Z") {
          var color = this.colors.blue;
        } else if (event.date_heure_debut.split("T")[1] == "13:00:00.000Z") {
          var color = this.colors.green;
        } else {
          var color = this.colors.yellow;
        }
        this.events.push({
          start: new Date(
            event.date_heure_debut.split("-")[0],
            event.date_heure_debut.split("-")[1] - 1,
            event.date_heure_debut.split("-")[2].split("T")[0],
            event.date_heure_debut.split("-")[2].split("T")[1].split(":")[0],
            0,
            0,
          ),
          end: new Date(
            event.date_heure_fin.split("-")[0],
            event.date_heure_fin.split("-")[1] - 1,
            event.date_heure_fin.split("-")[2].split("T")[0],
            event.date_heure_fin.split("-")[2].split("T")[1].split(":")[0],
            0,
            0,
          ),
          title: event.nom,
          allDay: false,
          color: color,
          id: event.id,
          isAction: true,
          dateFinReccurrence: event.finReccurrence,
        });
      }
      this.setView(CalendarView.Week);
    });

    //On récupère la liste des zones d'une usine pour la création d'évènement du calendrier
    this.rondierService.listZone().subscribe((response) => {
      // @ts-expect-error data
      this.listZone = response.data;
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  //Fonction de la librairie calendar pour modifier la durée d'un évènement (non utilisée pour nous)
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }

  //fonction permettant d'afficher un évènement quand on clique dessus
  handleEvent(action: string, event: CalendarEvent): void {
    const dateDeb = format(event.start, "dd/MM/yyyy hh:mm:ss");
    //@ts-expect-error data
    const dateFin = format(event.end, "dd/MM/yyyy hh:mm:ss");
    this.modalData = {
      nom: event.title,
      event: event,
      dateDeb: dateDeb,
      dateFin: dateFin,
      ronde: event.ronde,
      isAction: event.isAction,
    };
    this.modal.open(this.modalContent, { size: "lg" });
  }

  //Fonction permettant d'afficher le bloc de création (choix zone ou action)
  addEvent(): void {
    $("#divCreation").show();
    $("#hideCreation").show();
    $("#create").hide();
  }

  //Fonction permettant de supprimer un évènement
  //TODO erreur sur Calce fait planté api ici
  deleteEvenement(
    id: any,
    deleteOccurence: boolean,
    isAction: boolean,
    dateDebutSupp: string,
  ) {
    dateDebutSupp =
      dateDebutSupp.substring(6, 10) +
      "-" +
      dateDebutSupp.substring(3, 5) +
      "-" +
      dateDebutSupp.substring(0, 2);
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
        //SI on veut supprimer l'occurence (fonctionne uniquement sur les actions)
        if (deleteOccurence) {
          if (isAction) {
            //On supprime les actions de l'occurence
            this.cahierQuartService
              .getOneEvenementCalendrier(id)
              .subscribe((response) => {
                const idAction = response.data[0].idAction;
                this.cahierQuartService
                  .deleteActionCalendrier(idAction, dateDebutSupp)
                  .subscribe((response) => {
                    if (
                      response == "Suppression des actions du calendrier OK"
                    ) {
                      this.popupService.alertSuccessForm(
                        "L'occurence a bien été supprimé !",
                      );
                      this.ngOnInit();
                    } else {
                      this.popupService.alertErrorForm(
                        "Erreur lors de la suppression de l'occurence....",
                      );
                    }
                  });
              });
          } else {
            this.cahierQuartService
              .getOneEvenementCalendrier(id)
              .subscribe((response) => {
                const idZone = response.data[0].idZone;
                const quart = response.data[0].quart;
                this.cahierQuartService
                  .deleteZoneCalendrier(idZone, quart, dateDebutSupp)
                  .subscribe((response) => {
                    if (response == "Suppression des zones du calendrier OK") {
                      this.popupService.alertSuccessForm(
                        "L'occurence a bien été supprimé !",
                      );
                      this.ngOnInit();
                    } else {
                      this.popupService.alertErrorForm(
                        "Erreur lors de la suppression de l'occurence....",
                      );
                    }
                  });
              });
          }
        } else {
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
        }
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La suppression a été annulée.");
      }
    });
  }

  //Fonction de la libraire calendar pour choisir la vue
  setView(view: CalendarView) {
    this.view = view;
  }

  //Fonction de la libraire calendar pour choisir la vue
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  //Fonction pour montrer le bloc de création d'actions
  showCreationAction() {
    $("#CreationRondeAction").show();
    $("#CreationRonde").hide();
    $("#CreationAction").css("display", "flex").show();
    $("#hideCreation").show();
  }

  //Fonction pour montrer le bloc de création de zones
  showCreationRonde() {
    $("#CreationRondeAction").show();
    $("#CreationRonde").show();
    $("#CreationAction").hide();
    $("#hideCreation").show();
  }

  pause(millisecondes: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, millisecondes));
  }

  //Fonction qui permet de cacher le bloc de création
  hideCreation() {
    $("#CreationRondeAction").hide();
    $("#CreationRonde").hide();
    $("#CreationAction").hide();
    $("#create").show();
    $("#hideCreation").hide();
    $("#divCreation").hide();
  }

  maxOccurence() {
    this.occurences = 1000;
  }

  loading() {
    $("#spinner").addClass("loader");
    $("#spinnerBloc").addClass("loaderBloc");
  }

  removeloading() {
    var element = document.getElementById("spinner");
    // @ts-expect-error data
    element.classList.remove("loader");
    var element = document.getElementById("spinnerBloc");
    // @ts-expect-error data
    element.classList.remove("loaderBloc");
  }

  ouvrirDialogCreerEvent() {
    this.dialogRef = this.dialog.open(this.createEventDialog, {
      width: "60%",
      disableClose: true,
      autoFocus: true,
    });
    this.dialog.afterAllClosed.subscribe((response) => {
      this.ngOnInit();
    });
  }

  ouvrirDialogReccurence() {
    this.dialogRef = this.dialog.open(this.createReccurenceDialog, {
      width: "40%",
      disableClose: true,
      autoFocus: true,
    });
    this.dialog.afterAllClosed.subscribe((response) => {
      this.ngOnInit();
    });
  }

  //Permet de choisir une action depuis une ligne pré-défini
  choixAction() {
    const listActionsEnregistrees = {};
    for (let i = 0; i < this.tabAction.length; i++) {
      //@ts-expect-error data
      listActionsEnregistrees[this.tabAction[i]["nom"]] =
        this.tabAction[i]["nom"];
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

  ajoutListeJours(jour: string) {
    if (this.listeJours.includes(jour)) {
      // Supprime le jour de la liste
      this.listeJours = this.listeJours.filter((j) => j !== jour);
    } else {
      // Ajoute le jour à la liste
      this.listeJours.push(jour);
    }

    if (this.listeJours.length == 7) {
      this.periodeReccurence = "jour";
    } else {
      this.periodeReccurence = "semaine";
    }
  }

  periodeReccurenceChange(nvPeriode: string) {
    this.periodeReccurence = nvPeriode;
    if (this.periodeReccurence == "jour") {
      this.listeJours = [];
      for (const jour of this.jours) {
        this.listeJours.push(jour);
      }
    }
  }

  saveRepetition() {
    this.setRepetition = true;
  }

  deleteRepetition() {
    this.setRepetition = false;
    this.periodeReccurence = "semaine";
    this.listeJours = [];
    this.dateFin = undefined;
    this.repeterChaque = 1;
  }

  //Fonction permettant de créer un évènement dans le calendrier
  async createEvenementCalendrier() {
    if (this.dateDeb <= this.today) {
      this.popupService.alertErrorForm(
        "La date de début doit être supérieure à la date actuelle !",
      );
      return;
    }
    this.loading();
    if (
      (this.nomAction == "" && this.listZoneSelection.length == 0) ||
      this.quart.length == 0 ||
      this.dateDeb == undefined ||
      this.dateDeb == ""
    ) {
      this.popupService.alertErrorForm("Veuillez remplir tout les champs !");
      return;
    }
    //On parcours la liste des quarts choisis
    for (const quart of this.quart) {
      //On récupère l'heure de fin en fonction du quart
      if (quart == 1) {
        var heureDeb = "05:00:00";
        var heureFin = "13:00:00";
      } else if (quart == 2) {
        var heureDeb = "13:00:00";
        var heureFin = "21:00:00";
      } else {
        var heureDeb = "21:00:00";
        var heureFin = "05:00:00";
      }

      //Si on a pas de periodicité, l'ajout ne se fait qu'une fois
      if (this.setRepetition == false) {
        //Si on est dans le quart 3, le jour de fin est le jour suivant
        if (quart != 3) {
          var dateFin = this.dateDeb + " " + heureFin;
        } else {
          var dateFin =
            format(addDays(parseISO(this.dateDeb), 1), "yyyy-MM-dd") +
            " " +
            heureFin;
        }
        const dateHeureDeb = this.dateDeb + " " + heureDeb;
        //Si on ajoute une zone
        if (this.radioSelect == "zone") {
          //On parcours la liste des zones pour toutes les ajouter
          for (const zone of this.listZoneSelection) {
            this.cahierQuartService
              .newCalendrierZone(zone, dateHeureDeb, quart, dateFin, null)
              .subscribe((response) => {
                const dateFin = "";
              });
          }
        }
        //si on ajoute une action
        else {
          this.cahierQuartService
            .newAction(this.nomAction, dateHeureDeb, dateFin)
            .subscribe((response) => {
              this.cahierQuartService
                .newCalendrierAction(
                  response.data[0].id,
                  response.data[0].date_heure_debut,
                  quart,
                  response.data[0].date_heure_fin,
                  0,
                  null,
                )
                .subscribe((response) => {
                  const dateFin = "";
                });
            });
        }
      } else {
        const dates = await this.genererDatesAjout(
          this.dateDeb,
          this.dateFin,
          this.repeterChaque,
          this.periodeReccurence,
          this.listeJours,
        );
        let nbOccurrence = 0;
        let idAction = 0;
        if (this.radioSelect !== "zone") {
          this.dateDeb = this.dateDeb + " " + heureDeb;
          this.dateFin = this.dateFin + " " + heureFin;
          nbOccurrence = dates.length * this.quart.length;
          try {
            const response = await this.cahierQuartService
              .newAction(this.nomAction, this.dateDeb, this.dateFin)
              .toPromise(); // Assurez-vous que `newAction` retourne une Observable
            idAction = response.data[0].id;
          } catch (error) {
            console.error("Erreur lors de l'appel à newAction:", error);
          }
        } else {
          nbOccurrence =
            this.listZoneSelection.length * dates.length * this.quart.length;
        }

        if (nbOccurrence > 1200) {
          Swal.fire({
            title: "Attention",
            text: "Vous avez sélectionné trop d'occurrences ou de zones. Veuillez réduire votre sélection.",
            icon: "warning",
            confirmButtonText: "OK",
          });
          return;
        }
        //Si on a une periodicite, on boucle pour ajouter autant de fois que d'occurences demandées
        for (const date of dates) {
          await this.pause(100);
          //Si on est en quotidient
          const dateHeureDeb = format(date, "yyyy-MM-dd") + " " + heureDeb;

          //Si on est dans le quart 3, le jour de fin est le jour suivant
          if (quart != 3) {
            var dateFin = dateHeureDeb.split(" ")[0] + " " + heureFin;
          } else {
            var dateFin =
              format(
                addDays(parseISO(dateHeureDeb.split(" ")[0]), 1),
                "yyyy-MM-dd",
              ) +
              " " +
              heureFin;
          }
          let recurrencePhrase = "";
          if (this.periodeReccurence === "jour") {
            recurrencePhrase = `Tous les ${this.repeterChaque > 1 ? this.repeterChaque + " jours" : "jours"}`;
          } else if (this.periodeReccurence === "semaine") {
            const joursStr = this.listeJours.join(", ");
            recurrencePhrase = `Toutes les ${this.repeterChaque > 1 ? this.repeterChaque + " semaines" : "semaines"} le(s) ${joursStr}`;
          } else if (this.periodeReccurence === "mois") {
            if (this.radioMois === "occurenceMois") {
              recurrencePhrase = `Tous les ${this.repeterChaque > 1 ? this.repeterChaque + " mois" : "mois"}, le ${this.occurenceMois}er/ème ${this.jourMois}`;
            } else {
              recurrencePhrase = `Tous les ${this.repeterChaque > 1 ? this.repeterChaque + " mois" : "mois"}, le ${this.numeroJour}`;
            }
          }
          await this.pause(100);
          //Si on ajoute une zone
          if (this.radioSelect == "zone") {
            //On parcours la liste des zones pour toutes les ajouter
            for (const zone of this.listZoneSelection) {
              this.cahierQuartService
                .newCalendrierZone(
                  zone,
                  dateHeureDeb,
                  quart,
                  dateFin,
                  this.dateFin,
                  recurrencePhrase,
                )
                .subscribe((response) => {
                  const dateFin = "";
                });
            }
          }
          //Si on ajoute une action
          else {
            this.cahierQuartService
              .newCalendrierAction(
                idAction,
                dateHeureDeb,
                quart,
                dateFin,
                0,
                this.dateFin,
                recurrencePhrase,
              )
              .subscribe((response) => {
                const dateFin = "";
              });
          }
        }
      }
    }
    this.removeloading();
    this.dialog.closeAll();
  }

  //Fonction qui permet de générer la liste des dates sur lesquelles ajouter l'action ou la zone
  async genererDatesAjout(
    dateDeb: Date,
    dateFin: Date,
    repeterChaque: number,
    periodeReccurence: string,
    listeJours: string[],
  ): Promise<Date[]> {
    const dates: Date[] = [];
    let currentDate = new Date(dateDeb);
    const dateDebut = currentDate;
    const endDate = new Date(dateFin);
    const jours = [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ];

    //Si on est en jour, on parcours tous les jours jusqu'à la date de fin et on les ajoute dans le tableau
    if (periodeReccurence == "jour") {
      while (currentDate.getTime() < endDate.getTime()) {
        dates.push(currentDate);
        currentDate = addDays(currentDate, repeterChaque);
      }
      dates.push(currentDate);
    }

    //Si on est en semaine
    if (periodeReccurence === "semaine") {
      //On parcout tous les jours
      while (currentDate.getTime() <= endDate.getTime()) {
        //On récupère le numéro de la semaine de la date
        const currentWeekNumber = Math.floor(
          (currentDate.getTime() - dateDebut.getTime()) /
            (7 * 24 * 60 * 60 * 1000),
        );
        //On regarde sur le numéro de la semaine correspond à la répéter chaque
        //Utile quand on veut répéter un event toutes les 2 semaines par exemple
        if (currentWeekNumber % repeterChaque === 0) {
          //On regarde si le jour de la date est dans les jours souhaités et on ajoute
          if (listeJours.includes(jours[currentDate.getDay()])) {
            dates.push(new Date(currentDate));
          }
        }
        currentDate = addDays(currentDate, 1);
      }
    }

    //Si on est en mois
    if (periodeReccurence === "mois") {
      if (this.radioMois == "occurenceMois") {
        //On parcout tous les jours
        while (currentDate.getTime() <= endDate.getTime()) {
          const occurrence = this.occurenceMois;
          const dayString = this.jourMois;

          // Convertir le jour en string en un index (0: dimanche, 1: lundi, ...)
          const targetDayIndex = jours.indexOf(dayString.toLowerCase());

          // Aller au début du mois
          const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1,
          );

          let occurrenceCount = 0;
          let day = new Date(firstDayOfMonth);

          // Parcourir tous les jours du mois
          while (day.getMonth() === firstDayOfMonth.getMonth()) {
            if (day.getDay() === targetDayIndex) {
              occurrenceCount++;
              if (occurrenceCount === occurrence) {
                dates.push(new Date(day));
                break;
              }
            }
            day = addDays(day, 1);
          }

          // Passer au mois suivant
          currentDate = new Date(
            firstDayOfMonth.getFullYear(),
            firstDayOfMonth.getMonth() + 1,
            1,
          );
        }
      } else {
        //On parcout tous les jours
        while (currentDate.getTime() <= endDate.getTime()) {
          if (currentDate.getDate() == this.numeroJour) {
            dates.push(new Date(currentDate));
          }
          currentDate = addDays(currentDate, 1);
        }
      }
    }

    return dates;
  }

  //Récupérer l'occurence d'une date dans le mois
  //ex: 2eme lundi du mois
  getJourOccurrenceMois(date: Date) {
    date = new Date(date);
    const daysOfWeek = [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ];
    const dayIndex = date.getDay(); // Jour de la semaine (0 = dimanche, ..., 6 = samedi)
    this.jourMois = daysOfWeek[dayIndex];
    this.numeroJour = date.getDate();

    // Trouver le premier jour du mois
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    // Calculer l'occurrence du jour dans le mois
    this.occurenceMois = 0;
    for (let day = 1; day <= date.getDate(); day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
      if (currentDate.getDay() === dayIndex) {
        this.occurenceMois++;
      }
    }
  }

  isDateValide(dateDeb: string | Date | undefined): boolean {
    if (!dateDeb) {
      return true; // Désactive par défaut si la date n'existe pas
    }
    const currentDate = new Date();
    const eventDate = new Date(dateDeb);
    return currentDate > eventDate;
  }
}
