import { Component, OnInit } from "@angular/core";
import { cahierQuartService } from "../services/cahierQuart.service";
import { DatePipe, Location } from "@angular/common";
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import { addDays, format, parseISO } from "date-fns";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"],
})
export class ActionComponent implements OnInit {
  public nom: string;
  public quart: number;
  public dateDeb: Date | undefined;
  public idAction: number;

  constructor(
    public cahierQuartService: cahierQuartService,
    private popupService: PopupService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.nom = "";
    this.quart = 1;
    this.idAction = 0;
    //Permet de savoir si on est en mode édition ou création
    this.route.queryParams.subscribe((params) => {
      if (params.idAction != undefined) {
        this.idAction = params.idAction;
      } else {
        this.idAction = 0;
      }
    });
  }

  ngOnInit(): void {
    //Si on est en mode édition
    if (this.idAction > 0) {
      //On récupère l'action
      this.cahierQuartService
        .getOneAction(this.idAction)
        .subscribe((response) => {
          this.nom = response.data[0]["nom"];
          this.dateDeb = response.data[0]["date_heure_debut"].split("T")[0];
          //Pour l'édition il faut récupérer le quart pour la table calendrier car le quart n'est pas dans la table action
          if (
            response.data[0]["date_heure_fin"].split("T")[1] == "05:00:00.000Z"
          ) {
            this.quart = 3;
          } else if (
            response.data[0]["date_heure_fin"].split("T")[1] == "13:00:00.000Z"
          ) {
            this.quart = 1;
          } else {
            this.quart = 2;
          }
        });
    }
  }

  //Création ou édition d'une action
  newActu() {
    //Il faut avoir renseigné une date de début
    if (this.dateDeb != undefined) {
      const dateDebString = this.datePipe.transform(
        this.dateDeb,
        "yyyy-MM-dd HH:mm",
      );
    } else {
      this.popupService.alertErrorForm(
        "Veuillez choisir une date de début. La saisie a été annulée.",
      );
      return;
    }
    //Il faut avoir renseigné un nom
    if (this.nom == "") {
      this.popupService.alertErrorForm(
        "Veuillez renseigner le nom de l'action. La saisie a été annulée.",
      );
      return;
    }
    //Choix de la phrase à afficher en fonction du mode
    if (this.idAction > 0) {
      var question = "Êtes-vous sûr(e) de modifier cette action ?";
    } else var question = "Êtes-vous sûr(e) de créer cette action ?";

    //Demande de confirmation de création d'équipe
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
        //Récupération de l'heure de début et de fin en fonction du quart sélectionné
        if (this.quart == 1) {
          var heureDeb = "05:00:00";
          var heureFin = "13:00:00";
        } else if (this.quart == 2) {
          var heureDeb = "13:00:00";
          var heureFin = "21:00:00";
        } else {
          var heureDeb = "21:00:00";
          var heureFin = "05:00:00";
        }

        //Si on est dans le quart 3, le jour de fin est le jour suivant
        if (this.quart != 3) {
          var dateFin = this.dateDeb + " " + heureFin;
        } else {
          var dateFin =
            //@ts-expect-error data
            format(addDays(parseISO(this.dateDeb), 1), "yyyy-MM-dd") +
            " " +
            heureFin;
        }
        const dateDeb2 = this.dateDeb + " " + heureDeb;

        //Si on est en mode édition
        if (this.idAction != 0) {
          this.cahierQuartService
            .updateAction(this.nom, dateDeb2, dateFin, this.idAction)
            .subscribe((response) => {
              this.cahierQuartService
                .updateCalendrierAction(
                  this.idAction,
                  dateDeb2,
                  this.quart,
                  dateFin,
                )
                .subscribe((response) => {
                  const dateFin = "";
                  this.popupService.alertSuccessForm("Action modifiée");
                  this.location.back();
                });
            });
        }
        //Sinon on créé l'actu
        else {
          this.cahierQuartService
            .newAction(this.nom, dateDeb2, dateFin)
            .subscribe((response) => {
              this.cahierQuartService
                .newCalendrierAction(
                  response.data[0].id,
                  response.data[0].date_heure_debut,
                  this.quart,
                  response.data[0].date_heure_fin,
                  0,
                  null,
                )
                .subscribe((response) => {
                  const dateFin = "";
                  this.popupService.alertSuccessForm("Nouvelle action créée");
                  this.location.back();
                });
            });
        }
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La création a été annulée.");
      }
    });
  }
}
