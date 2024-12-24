import { Component, OnInit } from "@angular/core";
import { cahierQuartService } from "../services/cahierQuart.service";
import { DatePipe, Location } from "@angular/common";
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-liens-externes",
  templateUrl: "./liens-externes.component.html",
  styleUrls: ["./liens-externes.component.scss"],
})
export class LiensExternesComponent implements OnInit {
  public nom: string;
  public url: string;
  public idLien: number;

  constructor(
    public cahierQuartService: cahierQuartService,
    private popupService: PopupService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.nom = "";
    this.idLien = 0;
    this.url = "";

    //Permet de savoir si on est en mode édition ou création
    this.route.queryParams.subscribe((params) => {
      if (params.idLien != undefined) {
        this.idLien = params.idLien;
      } else {
        this.idLien = 0;
      }
    });
  }

  ngOnInit(): void {
    //Si on est en mode édition
    if (this.idLien > 0) {
      //On récupère l'actu
      this.cahierQuartService
        .getOneLienExterne(this.idLien)
        .subscribe((response) => {
          // console.log(response.data);
          this.nom = response.data[0]["nom"];
          this.url = response.data[0]["url"];
        });
    }
  }

  //Création ou édition d'un lien
  newLienExterne() {
    //Il faut avoir renseigné un nom
    if (this.nom == "") {
      this.popupService.alertErrorForm(
        "Veuillez renseigner le nom du fichier correspondant au lien. La saisie a été annulée.",
      );
      return;
    }
    //Il faut avoir renseigné un url
    if (this.url == "") {
      this.popupService.alertErrorForm(
        "Veuillez renseigner l'url du fichier. La saisie a été annulée.",
      );
      return;
    }
    //Choix de la phrase à afficher en fonction du mode
    if (this.idLien > 0) {
      var question = "Êtes-vous sûr(e) de modifier ce lien ?";
    } else var question = "Êtes-vous sûr(e) de créer ce lien ?";
    //Demande de confirmation de création du lien
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
        //Si on est en mode édition d'un lien on va dans la fonction update
        if (this.idLien != 0) {
          this.cahierQuartService
            .updateLienExterne(this.nom, this.url, this.idLien)
            .subscribe((response) => {
              if (response == "Modif du lien OK !") {
                this.popupService.alertSuccessForm("Lien modifié !");
              }
            });
        }
        //Sinon on créé le lien
        else {
          this.cahierQuartService
            .newLienExterne(this.nom, this.url)
            .subscribe((response) => {
              // console.log(response);
              if (response == "Création du lien OK !") {
                this.popupService.alertSuccessForm("Nouveau lien créé");
                this.location.back();
              }
            });
        }
      } else {
        // Pop-up d'annulation de la création
        this.popupService.alertErrorForm("La création a été annulée.");
      }
    });
  }
}
