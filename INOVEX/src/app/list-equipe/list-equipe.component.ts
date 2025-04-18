import { Component, OnInit } from "@angular/core";
import { cahierQuartService } from "../services/cahierQuart.service";
import { equipe } from "../../models/equipe.model";
import Swal from "sweetalert2";
import { consigne } from "src/models/consigne.model";
import { rondierService } from "../services/rondier.service";
import { PopupService } from "../services/popup.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-list-equipe",
  templateUrl: "./list-equipe.component.html",
  styleUrls: ["./list-equipe.component.scss"],
})
export class ListEquipeComponent implements OnInit {
  public equipes: equipe[];
  public consignes: consigne[];
  public dateDuJour: string;

  constructor(
    public cahierQuartService: cahierQuartService,
    public rondierService: rondierService,
    private popupService: PopupService,
    private router: Router,
  ) {
    this.equipes = [];
    this.consignes = [];
    const date = new Date();

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateFormateur = new Intl.DateTimeFormat("fr-FR", options);
    this.dateDuJour = dateFormateur.format(date);
  }

  ngOnInit(): void {
    //On récupère la liste des équipes
    this.cahierQuartService.getEquipes().subscribe((response) => {
      this.equipes = response.tabEquipes;
    });

    //On récupére la liste des consignes en cours de validité
    this.rondierService.listConsignes().subscribe((response) => {
      //@ts-expect-error data
      this.consignes = response.data;
    });
  }

  //Fonction qui permet d'agrandir une card contenant les informations sur une équipe
  toggleCardSize(equipe: equipe) {
    if (equipe.rondiers.length == 0) {
      // document.location.href =
      //   "https://fr-couvinove300.prod.paprec.fr:8100/cahierQuart/newEquipe?idEquipe=" +
      //   equipe.id;
      this.router.navigate(["/cahierQuart/newEquipe"], {
        queryParams: { idEquipe: equipe.id },
      });
    } else {
      //@ts-expect-error data
      document
        .getElementById(equipe.id + "_overlay")
        .classList.add("show") as HTMLElement;
      const exp = document.getElementById(String(equipe.id));
      if (exp != null) exp.classList.add("expanded");
      //@ts-expect-error data
      document
        .getElementById(equipe.id + "_chefQuart")
        .classList.remove("hide") as HTMLElement;
    }
  }

  //Fonction qui permet de fermer une card
  closeCard(equipe: equipe) {
    const chef = document.getElementById(equipe.id + "_chefQuart");
    if (chef != null) chef.classList.add("hide");
    //@ts-expect-error data
    document
      //@ts-expect-error data
      .getElementById(equipe.id)
      .classList.remove("expanded") as HTMLElement;
    const over = document.getElementById(equipe.id + "_overlay");
    if (over != null) over.classList.remove("show");
  }

  deleteEquipe(idEquipe: number) {
    Swal.fire({
      title: "Êtes-vous sûr(e) de vouloir supprimer cette équipe ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.cahierQuartService
          .deleteAffectationEquipe(idEquipe)
          .subscribe((response) => {
            this.cahierQuartService
              .deleteEquipe(idEquipe)
              .subscribe((response) => {
                this.ngOnInit();
                this.popupService.alertSuccessForm(
                  "La suprression a été effectuée.",
                );
              });
          });
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La suprression a été annulée.");
      }
    });
  }
}
