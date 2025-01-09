import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PopupService } from "./popup.service";

@Injectable()
export class dateService {
  constructor(private popupService: PopupService) {}
  //récupérer les jours de la période
  getDays(start: Date, end: Date) {
    let arr = [],
      dt = new Date(start);
    for (
      arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      const dd = String(dt.getDate()).padStart(2, "0");
      const mm = String(dt.getMonth() + 1).padStart(2, "0"); //January is 0!
      const yyyy = dt.getFullYear();
      const day = dd + "/" + mm + "/" + yyyy;
      arr.push(day);
      // console.log(day);
    }
    return arr;
  }

  //Pop-up en cas de mauvaise entrée de dates
  mauvaiseEntreeDate(form: NgForm) {
    form.controls["dateFin"].reset();
    form.value["dateFin"] = "";
    this.popupService.alertErrorForm(
      "La date de Fin est inférieure à la date de Départ !",
    );
  }

  //changer les dates pour saisir les 2 derniers jours
  set2Days(form: NgForm) {
    const date = new Date();
    const yyyy = date.getFullYear();
    let dd = String(date.getDate() - 1).padStart(2, "0");
    let ddBefore = String(date.getDate() - 2).padStart(2, "0");
    let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    let mmBefore = String(date.getMonth() + 1).padStart(2, "0");
    //Si après décrémentation du jour on a 0, on prend le dernier jour du mois dernier
    if (dd === "00") {
      dd = String(new Date(yyyy, date.getMonth(), 0).getDate()).padStart(
        2,
        "0",
      );
      mm = String(date.getMonth()).padStart(2, "0");
      mmBefore = mm;
      ddBefore = String(
        new Date(yyyy, date.getMonth(), 0).getDate() - 1,
      ).padStart(2, "0");
    }
    if (ddBefore === "00") {
      ddBefore = String(new Date(yyyy, date.getMonth(), 0).getDate()).padStart(
        2,
        "0",
      );
      mmBefore = String(date.getMonth()).padStart(2, "0");
    }
    const day = yyyy + "-" + mm + "-" + dd;
    const dayBefore = yyyy + "-" + mmBefore + "-" + ddBefore;
    (document.getElementById("dateDeb") as HTMLInputElement).value = dayBefore;
    (document.getElementById("dateFin") as HTMLInputElement).value = day;
    form.value["dateDeb"] = dayBefore;
    form.value["dateFin"] = day;
  }

  //changer les dates pour saisir hier
  setYesterday(form: NgForm) {
    const date = new Date();
    const yyyy = date.getFullYear();
    let dd = String(date.getDate() - 1).padStart(2, "0");
    let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    if (dd === "00") {
      dd = String(new Date(yyyy, date.getMonth(), 0).getDate()).padStart(
        2,
        "0",
      );
      mm = String(date.getMonth()).padStart(2, "0");
    }
    const day = yyyy + "-" + mm + "-" + dd;
    // console.log(document.getElementById("dateDeb") as HTMLInputElement);
    //@ts-expect-error data
    document.getElementById("dateDeb").value = day;
    (document.getElementById("dateFin") as HTMLInputElement).value = day;
    form.value["dateDeb"] = day;
    form.value["dateFin"] = day;
  }

  //Fonction non utilisée
  resetForm(form: NgForm) {
    form.controls["dateDeb"].reset();
    form.value["dateDeb"] = "";
    form.controls["dateFin"].reset();
    form.value["dateFin"] = "";
  }

  //changer les dates pour saisir la semaine en cours
  setCurrentWeek(form: NgForm) {
    const date = new Date();
    //le début de la semaine par défaut est dimanche (0)
    const firstday = new Date(date.setDate(date.getDate() - date.getDay() + 1));
    const lastday = new Date(date.setDate(date.getDate() - date.getDay() + 7));
    const ddF = String(firstday.getDate()).padStart(2, "0");
    const mmF = String(firstday.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyyF = firstday.getFullYear();
    const firstDayOfWeek = yyyyF + "-" + mmF + "-" + ddF;
    const ddL = String(lastday.getDate()).padStart(2, "0");
    const mmL = String(lastday.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyyL = lastday.getFullYear();
    const LastDayOfWeek = yyyyL + "-" + mmL + "-" + ddL;

    (document.getElementById("dateDeb") as HTMLInputElement).value =
      firstDayOfWeek;
    (document.getElementById("dateFin") as HTMLInputElement).value =
      LastDayOfWeek;
    form.value["dateDeb"] = firstDayOfWeek;
    form.value["dateFin"] = LastDayOfWeek;
  }

  //changer les dates pour saisir le mois en cours
  setCurrentMonth(form: NgForm) {
    const date = new Date();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = date.getFullYear();
    const dd = String(
      new Date(yyyy, date.getMonth() + 1, 0).getDate(),
    ).padStart(2, "0");

    const Fisrtday = yyyy + "-" + mm + "-" + "01";
    const Lastday = yyyy + "-" + mm + "-" + dd;
    (document.getElementById("dateDeb") as HTMLInputElement).value = Fisrtday;
    (document.getElementById("dateFin") as HTMLInputElement).value = Lastday;
    form.value["dateDeb"] = Fisrtday;
    form.value["dateFin"] = Lastday;
  }

  //changer les dates pour saisir le mois précédent
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

    const Lastday = yyyy + "-" + mm;
    (document.getElementById("dateDeb") as HTMLInputElement).value = Lastday;
    form.value["dateDeb"] = Lastday;
  }

  //afficher le dernier jour de chaque mois de l'année en cours
  setYear() {
    let listDays: string[];
    listDays = [];
    const date = new Date();
    const yyyy = date.getFullYear();
    for (let i = 1; i < 13; i++) {
      const dd = String(new Date(yyyy, i, 0).getDate()).padStart(2, "0");
      if (i < 10) {
        listDays.push(dd + "/" + 0 + i + "/" + yyyy);
      } else listDays.push(dd + "/" + i + "/" + yyyy);
    }
    return listDays;
  }

  //afficher le dernier jour de chaque mois de l'année en cours
  setLastYear() {
    let listDays: string[];
    listDays = [];
    const date = new Date();
    const yyyy = date.getFullYear() - 1;
    for (let i = 1; i < 13; i++) {
      const dd = String(new Date(yyyy, i, 0).getDate()).padStart(2, "0");
      if (i < 10) {
        listDays.push(dd + "/" + 0 + i + "/" + yyyy);
      } else listDays.push(dd + "/" + i + "/" + yyyy);
    }
    return listDays;
  }
}
