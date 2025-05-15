import { Component, OnInit } from "@angular/core";
import { cahierQuartService } from "../services/cahierQuart.service";
import { addDays, format, parseISO } from "date-fns";
import Swal from "sweetalert2";
import { PopupService } from "../services/popup.service";
interface GroupedOccurrence {
  nomZone: string;
  date_heure_fin: string;
  finReccurrence: string;
  quart: number;
  count: number;
  isAction: boolean;
  type: string;
  periodicityType?: string;
  recurrencePhrase?: string;
  idAction: number;
  idZone: number;
}

@Component({
  selector: "app-list-occurences",
  templateUrl: "./list-occurences.component.html",
  styleUrls: ["./list-occurences.component.scss"],
})
export class ListOccurencesComponent implements OnInit {
  public listOccurences: GroupedOccurrence[] = [];
  private originalList: GroupedOccurrence[] = [];
  private sortHistory: { column: string; direction: "asc" | "desc" }[] = [];

  sortColumn = "";
  sortDirection: "asc" | "desc" = "asc";
  searchText = "";
  filterDateDebut = "";
  filterDateFin = "";
  sortState: Record<string, "asc" | "desc" | null> = {};
  hideExpiredOccurrences = false;
  hideCurrentOccurrences = false;
  constructor(
    private cahierQuartService: cahierQuartService,
    private popupService: PopupService,
  ) {}

  ngOnInit() {
    this.loadOccurences();
  }

  loadOccurences() {
    // Charger et grouper les zones
    this.cahierQuartService.getAllZonesCalendrier().subscribe((response) => {
      const groupedZones = this.cahierQuartService.groupAndCountOccurrences(
        response.data.map((zone: any) => ({
          ...zone,
          nomZone: zone.nom,
          finReccurrence: zone.finReccurrence,
          recurrencePhrase: zone.recurrencePhrase,
          isAction: false,
          type: "Zone",
        })),
      );
      // Charger et grouper les actions
      this.cahierQuartService
        .getAllActionsCalendrier()
        .subscribe((response) => {
          console.log(response);
          const groupedActions =
            this.cahierQuartService.groupAndCountOccurrences(
              response.data.map((action: any) => ({
                ...action,
                nomZone: action.nom,
                finReccurrence: action.finReccurrence,
                recurrencePhrase: action.recurrencePhrase,
                quart: this.getQuartFromHour(action.date_heure_debut),
                isAction: true,
                type: "Action",
              })),
            );
          console.log(groupedActions);
          // Combiner et trier par nomZone par défaut
          this.listOccurences = [...groupedZones, ...groupedActions].sort(
            (a, b) => a.nomZone.localeCompare(b.nomZone),
          );
          this.originalList = [...this.listOccurences];
        });
    });
  }

  getQuartFromHour(dateTime: string): number {
    const hour = dateTime.split("T")[1].split(":")[0];
    if (hour === "05") return 1; // Matin
    if (hour === "13") return 2; // Après-midi
    return 3; // Nuit
  }

  getQuartLibelle(quart: number): string {
    switch (quart) {
      case 1:
        return "Matin";
      case 2:
        return "Après-midi";
      case 3:
        return "Nuit";
      default:
        return "";
    }
  }

  sortData(column: string) {
    // Si la colonne est déjà dans l'historique, inverser sa direction
    const existingSort = this.sortHistory.find(
      (sort) => sort.column === column,
    );
    if (existingSort) {
      existingSort.direction =
        existingSort.direction === "asc" ? "desc" : "asc";
      // Déplacer cette colonne au début de l'historique
      this.sortHistory = [
        existingSort,
        ...this.sortHistory.filter((sort) => sort.column !== column),
      ];
    } else {
      // Ajouter la nouvelle colonne au début
      this.sortHistory.unshift({
        column: column,
        direction: "asc",
      });
    }

    // Trier les données en appliquant tous les critères de tri
    this.listOccurences.sort((a, b) => {
      // Parcourir tous les critères de tri dans l'ordre
      for (const sortCriteria of this.sortHistory) {
        let comparison = 0;

        switch (sortCriteria.column) {
          case "type":
            comparison = this.compareValues(a.type, b.type);
            break;

          case "nomZone":
            comparison = this.compareValues(a.nomZone, b.nomZone);
            break;

          case "quart":
            comparison = this.compareValues(a.quart || 0, b.quart || 0);
            break;

          case "finReccurrence": {
            const dateA = new Date(a.finReccurrence || a.date_heure_fin);
            const dateB = new Date(b.finReccurrence || b.date_heure_fin);
            comparison = dateA.getTime() - dateB.getTime();
            break;
          }

          case "count":
            comparison = this.compareValues(a.count || 0, b.count || 0);
            break;
        }

        // Si on trouve une différence, appliquer la direction et retourner le résultat
        if (comparison !== 0) {
          return sortCriteria.direction === "asc" ? comparison : -comparison;
        }
      }
      return 0;
    });

    // Mettre à jour l'état visuel du tri
    this.sortState[column] =
      this.sortHistory.find((sort) => sort.column === column)?.direction ||
      null;
  }

  // Méthode utilitaire pour comparer deux valeurs de manière sécurisée
  private compareValues(a: string | number, b: string | number): number {
    if (typeof a === "string" && typeof b === "string") {
      return a.localeCompare(b);
    }
    if (typeof a === "number" && typeof b === "number") {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    }
    // Fallback: convert both to string and compare
    return String(a).localeCompare(String(b));
  }

  filterByPeriod() {
    if (!this.filterDateFin) {
      this.listOccurences = [...this.originalList];
      return;
    }

    const endDate = new Date(this.filterDateFin);

    this.listOccurences = this.originalList.filter((occ) => {
      const occDate = new Date(occ.finReccurrence || occ.date_heure_fin);
      return occDate <= endDate;
    });
  }

  filterByText() {
    if (!this.searchText && !this.filterDateFin) {
      this.listOccurences = [...this.originalList];
      return;
    }

    this.listOccurences = this.originalList.filter((occ) => {
      let matchesText = true;
      let matchesDate = true;

      // Filtre par texte
      if (this.searchText) {
        matchesText = occ.nomZone
          .toLowerCase()
          .includes(this.searchText.toLowerCase());
      }

      // Filtre par date de fin
      if (this.filterDateFin) {
        const endDate = new Date(this.filterDateFin);
        const occDate = new Date(occ.date_heure_fin);
        matchesDate = occDate <= endDate;
      }

      return matchesText && matchesDate;
    });
  }

  filterOccurrences() {
    let filteredList = [...this.originalList];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filtrer par texte si présent
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filteredList = filteredList.filter((occ) =>
        occ.nomZone.toLowerCase().includes(searchLower),
      );
    }

    // Filtrer par période si les dates sont présentes
    if (this.filterDateDebut || this.filterDateFin) {
      const startDate = this.filterDateDebut
        ? new Date(this.filterDateDebut)
        : new Date(0);
      const endDate = this.filterDateFin
        ? new Date(this.filterDateFin)
        : new Date("9999-12-31");

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      filteredList = filteredList.filter((occ) => {
        const occDate = new Date(occ.finReccurrence || occ.date_heure_fin);
        return occDate >= startDate && occDate <= endDate;
      });
    }

    // Filtrer les occurrences en cours si la case est cochée
    if (this.hideCurrentOccurrences) {
      filteredList = filteredList.filter((occ) => {
        const occDate = new Date(occ.finReccurrence || occ.date_heure_fin);
        return occDate <= today;
      });
    }

    // Filtrer les occurrences expirées si la case est cochée
    if (this.hideExpiredOccurrences) {
      filteredList = filteredList.filter((occ) => {
        const occDate = new Date(occ.finReccurrence || occ.date_heure_fin);
        return occDate >= today;
      });
    }

    this.listOccurences = [...filteredList];

    // Réappliquer le tri si une colonne est triée
    if (this.sortColumn) {
      this.sortData(this.sortColumn);
    }
  }

  toggleExpiredOccurrences() {
    this.hideExpiredOccurrences = !this.hideExpiredOccurrences;
    this.filterOccurrences();
  }

  resetFilters() {
    this.searchText = "";
    this.filterDateDebut = "";
    this.filterDateFin = "";
    this.hideExpiredOccurrences = false;
    this.hideCurrentOccurrences = false;
    this.sortState = {};
    this.listOccurences = [...this.originalList];
  }
  resetSorts() {
    this.sortHistory = [];
    this.sortState = {};
    this.loadOccurences();
  }

  async genererDatesAjout(
    dateDeb: Date,
    dateFin: Date,
    recurrencePhrase: string,
  ): Promise<Date[]> {
    const dates: Date[] = [];
    let currentDate = new Date(dateDeb);
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

    // Parsing de la phrase de récurrence
    if (recurrencePhrase.startsWith("Tous les")) {
      const parts = recurrencePhrase.split(" ");

      // Cas quotidien
      if (recurrencePhrase.includes("jours")) {
        const interval = parts[2] === "jours" ? 1 : parseInt(parts[2]);
        while (currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate = addDays(currentDate, interval);
        }
      }

      // Cas mensuel
      else if (recurrencePhrase.includes("mois")) {
        const interval = parts[2] === "mois," ? 1 : parseInt(parts[2]);
        const dayPart = recurrencePhrase.split(", le ")[1];
        if (dayPart.includes("er/ème")) {
          const [occurrenceStr, jour] = dayPart.split("er/ème ");
          const occurrence = parseInt(occurrenceStr);
          const targetDay = jours.indexOf(jour.toLowerCase());

          while (currentDate <= endDate) {
            const firstDayOfMonth = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              1,
            );
            let count = 0;
            let day = new Date(firstDayOfMonth);

            while (day.getMonth() === firstDayOfMonth.getMonth()) {
              if (day.getDay() === targetDay) {
                if (++count === occurrence) {
                  if (day >= dateDeb && day <= endDate) {
                    dates.push(new Date(day));
                  }
                  break;
                }
              }
              day = addDays(day, 1);
            }
            currentDate = new Date(
              firstDayOfMonth.getFullYear(),
              firstDayOfMonth.getMonth() + interval,
              1,
            );
          }
        } else {
          const dayNumber = parseInt(dayPart);
          while (currentDate <= endDate) {
            if (currentDate.getDate() === dayNumber) {
              dates.push(new Date(currentDate));
            }
            currentDate = addDays(currentDate, 1);
          }
        }
      }
    }

    // Cas hebdomadaire
    else if (recurrencePhrase.startsWith("Toutes les")) {
      const [intervalPart, daysPart] = recurrencePhrase.split(" le(s) ");
      const interval = intervalPart.includes("semaines")
        ? parseInt(intervalPart.split(" ")[2]) || 1
        : 1;
      const targetDays = daysPart
        .split(", ")
        .map((d) => jours.indexOf(d.toLowerCase()));

      const startWeek = this.getWeekNumber(dateDeb);
      while (currentDate <= endDate) {
        const currentWeek = this.getWeekNumber(currentDate);
        if ((currentWeek - startWeek) % interval === 0) {
          if (targetDays.includes(currentDate.getDay())) {
            dates.push(new Date(currentDate));
          }
        }
        currentDate = addDays(currentDate, 1);
      }
    }

    return dates;
  }

  private getWeekNumber(d: Date): number {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    const week1 = new Date(date.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7,
      )
    );
  }

  openSelectionDate(event: GroupedOccurrence) {
    Swal.fire({
      title: "Sélectionnez la date de fin",
      input: "date",
      inputLabel: "Date de fin",
      inputValue: format(new Date(event.finReccurrence), "yyyy-MM-dd"),
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
      inputAttributes: {
        min: format(new Date(), "yyyy-MM-dd"),
      },
      preConfirm: (dateFin) => {
        if (!dateFin) {
          Swal.showValidationMessage("Veuillez sélectionner une date de fin.");
          return false;
        }
        if (new Date(dateFin) < new Date(event.finReccurrence)) {
          Swal.showValidationMessage(
            "La date de fin doit être supérieure à la date de récurrence.",
          );
          return false;
        }
        return dateFin;
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        await this.createEvenementCalendrier(event, result.value);
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "L'événement a été créé avec succès.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }

  async createEvenementCalendrier(
    event: GroupedOccurrence,
    dateFinRecurrence: string,
  ) {
    const dates = await this.genererDatesAjout(
      new Date(event.finReccurrence),
      new Date(dateFinRecurrence),
      event.recurrencePhrase || "",
    );
    console.log(dates);
    let nbOccurrence = 0;
    nbOccurrence = dates.length;

    if (nbOccurrence > 1200) {
      Swal.fire({
        title: "Attention",
        text: "Vous avez sélectionné trop d'occurrences ou de zones. Veuillez réduire votre sélection.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    let heureDeb: string;
    let heureFin: string;
    if (event.quart == 1) {
      heureDeb = "05:00:00";
      heureFin = "13:00:00";
    } else if (event.quart == 2) {
      heureDeb = "13:00:00";
      heureFin = "21:00:00";
    } else {
      heureDeb = "21:00:00";
      heureFin = "05:00:00";
    }

    //Si on a une periodicite, on boucle pour ajouter autant de fois que d'occurences demandées
    for (const date of dates) {
      await this.pause(100);
      //Si on est en quotidient
      const dateHeureDeb = format(date, "yyyy-MM-dd") + " " + heureDeb;

      //Si on est dans le quart 3, le jour de fin est le jour suivant
      let dateFin: string;
      if (event.quart != 3) {
        dateFin = dateHeureDeb.split(" ")[0] + " " + heureFin;
      } else {
        dateFin =
          format(
            addDays(parseISO(dateHeureDeb.split(" ")[0]), 1),
            "yyyy-MM-dd",
          ) +
          " " +
          heureFin;
      }

      //Si on ajoute une zone
      if (event.type === "Zone") {
        //On parcours la liste des zones pour toutes les ajouter
        this.cahierQuartService
          .newCalendrierZone(
            event.idZone,
            dateHeureDeb,
            event.quart,
            dateFin,
            dateFinRecurrence,
            event.recurrencePhrase,
          )
          .subscribe((response) => {
            this.ngOnInit();
          });
      }
      //Si on ajoute une action
      else {
        this.cahierQuartService
          .newCalendrierAction(
            event.idAction,
            dateHeureDeb,
            event.quart,
            dateFin,
            0,
            dateFinRecurrence,
            event.recurrencePhrase,
          )
          .subscribe((response) => {
            this.ngOnInit();
          });
      }
    }
  }

  pause(millisecondes: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, millisecondes));
  }

  // Vérifie si la date est passée
  isDatePassed(dateFin: string): boolean {
    const endDate = new Date(dateFin);
    const today = new Date();
    return endDate < today;
  }

  // Vérifie s'il reste moins d'une semaine
  isDateSoon(dateFin: string): boolean {
    const endDate = new Date(dateFin);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays > 0 && diffDays <= 7;
  }

  deleteOccurrence(event: GroupedOccurrence) {
    const today = new Date();
    const formattedToday =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0"); // format: 2025-05-14

    const dateDebutSupp = formattedToday;
    console.log(dateDebutSupp);
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
        if (event.type == "Action") {
          this.cahierQuartService
            .deleteActionCalendrier(event.idAction, dateDebutSupp)
            .subscribe((response) => {
              if (response == "Suppression des actions du calendrier OK") {
                this.cahierQuartService
                  .updateFinRecurrenceActionCalendrier(
                    event.idAction,
                    dateDebutSupp,
                    event.quart,
                  )
                  .subscribe((response) => {
                    this.popupService.alertSuccessForm(
                      "L'occurence a bien été supprimé !",
                    );
                    this.ngOnInit();
                  });
              } else {
                this.popupService.alertErrorForm(
                  "Erreur lors de la suppression de l'occurence....",
                );
              }
            });
        } else {
          this.cahierQuartService
            .deleteZoneCalendrier(event.idZone, event.quart, dateDebutSupp)
            .subscribe((response) => {
              if (response == "Suppression des zones du calendrier OK") {
                this.cahierQuartService
                  .updateFinRecurrenceZoneCalendrier(
                    event.idZone,
                    dateDebutSupp,
                    event.quart,
                  )
                  .subscribe((response) => {
                    this.popupService.alertSuccessForm(
                      "L'occurence a bien été supprimé !",
                    );
                    this.ngOnInit();
                  });
              } else {
                this.popupService.alertErrorForm(
                  "Erreur lors de la suppression de l'occurence....",
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
}
